import fs from "fs";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as FacebookStrategy,
  Profile as FacebookProfile,
} from "passport-facebook";
import AppleStrategy from "passport-apple";
import User from "../../modules/auth/auth.model.js";
import logger from "../utils/logger.js";

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL:
            process.env.GOOGLE_CALLBACK_URL || "/api/v1/auth/google/callback",
        },
        async (_accessToken, _refreshToken, profile: GoogleProfile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email)
              return done(new Error("Email not found from Google"), false);

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
          } catch (err: any) {
            logger.error(err);
            return done(err, false);
          }
        },
      ),
    );
  } catch (err) {
    logger.warn("Could not initialize Google OAuth strategy:", err);
  }
}

// Facebook Strategy
if (
  process.env.FACEBOOK_APP_ID &&
  process.env.FACEBOOK_APP_SECRET &&
  process.env.FACEBOOK_APP_ID !== "your_facebook_app_id"
) {
  try {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL:
            process.env.FACEBOOK_CALLBACK_URL || "/api/v1/auth/facebook/callback",
          profileFields: ["id", "emails", "name", "photos"],
        },
        async (_accessToken, _refreshToken, profile: FacebookProfile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email)
              return done(new Error("Email not found from Facebook"), false);

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
          } catch (err: any) {
            logger.error(err);
            return done(err, false);
          }
        },
      ),
    );
  } catch (err) {
    logger.warn("Could not initialize Facebook OAuth strategy:", err);
  }
}

// Apple Strategy
if (
  process.env.APPLE_CLIENT_ID &&
  process.env.APPLE_CLIENT_ID !== "your_apple_service_id" &&
  process.env.APPLE_PRIVATE_KEY_PATH &&
  fs.existsSync(process.env.APPLE_PRIVATE_KEY_PATH)
) {
  try {
    passport.use(
      new AppleStrategy(
        {
          clientID: process.env.APPLE_CLIENT_ID,
          teamID: process.env.APPLE_TEAM_ID || "",
          keyID: process.env.APPLE_KEY_ID || "",
          privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
          callbackURL:
            process.env.APPLE_CALLBACK_URL || "/api/v1/auth/apple/callback",
          passReqToCallback: true,
        },
        async (
          req: any,
          _accessToken: string,
          _refreshToken: string,
          _idToken: any,
          profile: any,
          done: any,
        ) => {
          try {
            const email = profile?.email || req.body?.email;
            if (!email) {
              return done(new Error("Email not provided by Apple"), false);
            }

            let user = await User.findOne({ email });

            if (!user) {
              user = await User.create({
                email,
                providers: {
                  apple: { id: profile?.sub || profile?.user, email },
                  local: { isVerified: true },
                },
              });
            }

            return done(null, user);
          } catch (err: any) {
            logger.error(err);
            return done(err, false);
          }
        },
      ),
    );
  } catch (err) {
    logger.warn("Could not initialize Apple OAuth strategy:", err);
  }
}

export default passport;
