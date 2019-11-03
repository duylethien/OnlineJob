const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     904232334975-dvq8ssmfsp28fsf9l8gm3dvvegtij5v4.apps.googleusercontent.com,
    clientSecret: qnyQjTPlVks8Vb4_G__ImVhk,
    callbackURL: "http://yourdormain:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));