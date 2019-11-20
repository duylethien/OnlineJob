const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
  });

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "904232334975-dvq8ssmfsp28fsf9l8gm3dvvegtij5v4.apps.googleusercontent.com",
      clientSecret: "qnyQjTPlVks8Vb4_G__ImVhk",
      callbackURL: "http://localhost:3000/api/user/auth/google/callback",
      passReqToCallback: true
    },
    (request, accessToken, refreshToken, profile, done) => {
      // Check if google profile exist.
      if (profile.id) {
        User.findOne({ gg_id: profile.id }).then(existingUser => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            new User({
              gg_id: profile.id,
              email: profile.emails[0].value,
              name: profile.name.familyName + " " + profile.name.givenName
            })
              .save()
              .then(user => done(null, user));
          }
        });
      }
    }

    //   async (request, accessToken, refreshToken, profile, done) => {
    //     const userIdExist = await UserModel.findOne({ gg_id: profile.id });
    //     if (userIdExist) return done(null, userIdExist)

    //     const user = new UserModel({
    //         username: profile.displayName,
    //         gg_id: profile.id,
    //         // date: request.body.date
    //     });
    //     try {
    //         const savedUser = await user.save();
    //         return done(null, savedUser);
    //     } catch (err) {
    //         return done(null, false);
    //     }

    //   })
  )
);
