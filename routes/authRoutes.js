const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

// AUTH ROUTES
router.post("/signin", authController.signin);

router.post("/register", authController.register);

// Google Auth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
    session: false,
  }),
  authController.googleSuccess
);

router.get("/google/failure", authController.googleFailure);

// Password reset routes
router.post("/request-reset", authController.passwordRequest);

router.post("/password-reset", authController.passwordReset);

module.exports = router;
