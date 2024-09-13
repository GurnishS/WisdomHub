// passport-setup.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/user.model.js";
import { ApiError } from "./ApiError.js";
const userStore = {};

const frontendURL = process.env.CORS_ORIGIN;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

// Serialize user into session
passport.serializeUser(function (user, done) {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser(function (user, done) {
  done(null, user);
});

export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleLoginCallback = (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/register");
    // Generate a temporary token
    const tempToken = uuidv4();
    userStore[tempToken] = user;
    // Redirect to frontend with the temporary token
    const userData = await User.findOne({ email: user.emails[0].value });
    if (!userData) {
      res.redirect(`${frontendURL}/register?token=${tempToken}`);
    } else {
      const accessToken = userData.generateAccessToken();
      const refreshToken = userData.generateRefreshToken();
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      userData.refreshToken = refreshToken;
      await userData.save({ validateBeforeSave: false });
      user.userId = userData._id;
      res.redirect(`${frontendURL}/login?token=${tempToken}`);
    }
  })(req, res, next);
};

export const fetchUserData = (req, res) => {
  const { token } = req.body;
  const user = userStore[token];
  if (user) {
    // Clean up the stored user data
    delete userStore[token];
    res.json(user);
  } else {
    throw new ApiError(404, "User not found");
  }
};

export default passport;
