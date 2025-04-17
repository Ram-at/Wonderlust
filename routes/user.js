const express = require("express");
const router = express.Router();

const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middlewares/middleware.js");
const userController = require("../controller/user.js");

router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.postSignup));
router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
