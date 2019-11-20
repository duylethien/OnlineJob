const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
require('../config/passport')(passport)
const { registerValiddation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
    const { error } = registerValiddation(req.body);

    if (error) return res.json({
        success: false,
        msg: error.details[0].message
    });

    const userNameExist = await User.findOne({ username: req.body.username });
    if (userNameExist) return res.json({
        success: false,
        msg: 'Username already exists'
    });

    const salt = await bcrypt.genSalt(10) ;
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({ 
        name: req.body.name,
        username: req.body.username,
        password: hashedPassword,
        date: req.body.date
    });
    try {
        const savedUser = await user.save();
        res.json({
            success: true,
            user: savedUser
        })
    } catch (err) {
        res.json({
            success: false,
            msg: err
        })
    }
});

// router.post('/loginn', async (req, res) => {
//     const { error } = loginValidation(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//         const user = await User.findOne({ username: req.body.username });
//         if (!user) return res.status(400).send('User not found');
        
//         const validPass = await bcrypt.compare(req.body.password, user.password);
//         if(!validPass) return res.status(400).send('Invalid password')
//         res.send('Logged in!');
// });

router.post('/login', (req, res) => {
    User.findOne({ 
        username: req.body.username 
    }).select('name username password').exec(function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({
                success: false,
                msg: 'Authentication failed. User not found'
            });
        } else if (user) {
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({ 
                    success: false,
                    msg: 'Authetication failed. Wrong password.'
                });
            } else {
                const token = jwt.sign({
                    id: user._id,
                    name: user.name,
                    username: user.username
                }, process.env.TOKEN_SECRET, {
                    expiresIn: '24h'
                });
                // res.header('auth-token', token).send(token);
                res.json({
                    success: true,
                    // token: 'JWT '+token,
                    token: token,
                    user: {
                        id: user._id,
                        username: user.username
                    }
                });
            }
        }
    });
})

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
  });

router.get('/auth/google', passport.authenticate('google', { scope: 'profile' }));

router.get( '/auth/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/api/user/profile',
        failureRedirect: '/auth/google/failure'
}));

// router.get( '/auth/google/callback', 
//     passport.authenticate('google'), (req, res) => {
//         const token = jwt.sign({
//             gg_id: req.gg_id,
//             name: req.name,
//             email: req.email
//         }, process.env.TOKEN_SECRET, {
//             expiresIn: '24h'
//         });
//         // res.header('auth-token', token).send(token);
//         res.json({
//             success: true,
//             token: token,
//             user: {
//                 id: req.gg_id,
//                 username: req.username
//             }
//         });
//         res.send(req.user);
//     });

module.exports = router;