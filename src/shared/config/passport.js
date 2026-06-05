const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const AppleStrategy = require("passport-apple").Strategy;
const User = require("../../modules/auth/auth.model");
const logger = require("../utils/logger");

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: "/api/v1/auth/google/callback",
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Email not found from Google"));

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            avatar: profile.photos?.[0]?.value,
            providers: {
              google: { id: profile.id, email },
              local: { isVerified: true },
            },
          });
        }

        return done(null, user);
      } catch (err) {
        logger.error(err);
        return done(err, null);
      }
    },
  ),
);

//Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/v1/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "photos"],
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Email not found from Facebook"));

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            providers: {
              facebook: { id: profile.id, email },
              local: { isVerified: true },
            },
          });
        }

        return done(null, user);
      } catch (err) {
        logger.error(err);
        return done(err, null);
      }
    },
  ),
);

// apple
passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
      callbackURL: "/api/v1/auth/apple/callback",
    },
    async (req, _, __, ___, profile, done) => {
      try {
        if (!profile?.email) {
          return done(new Error("Email not provided by Apple"));
        }

        let user = await User.findOne({ email: profile.email });

        if (!user) {
          user = await User.create({
            email: profile.email,
            providers: {
              apple: { id: profile.user, email: profile.email },
              local: { isVerified: true },
            },
          });
        }

        return done(null, user);
      } catch (err) {
        logger.error(err);
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
