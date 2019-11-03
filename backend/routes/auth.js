const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
require('../config/passport')(passport)
const { registerValiddation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = registerValiddation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database
    const userNameExist = await User.findOne({ username: req.body.username });
    if (userNameExist) return res.status(400).send('Username already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10) ;
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({ 
        name: req.body.name,
        username: req.body.username,
        password: hashedPassword,
        date: req.body.date
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/loginn', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
        //Checking if the email exists
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).send('User not found');
        //PASSWORD is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(400).send('Invalid password')
        res.send('Logged in!');
});

router.post('/login', (req, res) => {
    User.findOne({ 
        username: req.body.username 
    }).select('name username password').exec(function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found'
            });
        } else if (user) {
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({ 
                    success: false,
                    message: 'Authetication failed. Wrong password.'
                });
            } else {
                const token = jwt.sign({
                    id: user._id,
                    name: user.name,
                    username: user.username
                }, process.env.TOKEN_SECRET, {
                    expiresIn: '24h'
                });
                res.header('auth-token', token).send(token);
            }
        }
    });
})

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
  });

router.get('/auth/google',
  passport.authenticate('google', { scope: 
      [ 'https://www.googleapis.com/auth/plus.login',
      , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));

router.get( '/auth/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

module.exports = router;