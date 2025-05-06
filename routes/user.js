const express = require("express");
const router = express.Router();
const user = require("../database/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
// const { saveRedirectUrl } = require("../middlewares.js");
// const userController = require("../controllers/users.js");
router.get("/signup", (req, res) => {
  res.render("/user/signup.ejs");
});
router.post("/signup", async (req, res) => {
  let { username, email, password } = res.body;
  const newuser = new user({ email, username });
  const registeruser = await user.register(newuser, password);
  console.log(registeruser);
  req.flash("sucess", "welcome to RentnRest");
  res.redirect("/listings");
});
// router
//   .route("/signup")
//   .get(userController.renderSignupForm)
//   .post(wrapAsync(userController.signup));

// router
//   .route("/login")
//   .get(userController.renderLoginForm)
//   .post(
//     saveRedirectUrl,
//     passport.authenticate("local", {
//       failureRedirect: "/login",
//       failureFlash: true,
//     }),
//     userController.login
//   );

// router.get("/logout", userController.logout);

module.exports = router;
