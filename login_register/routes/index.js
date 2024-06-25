var express = require("express");
const userModel = require("./users");
const passport = require("passport");
var router = express.Router();
const localStrategy = require("passport-local").Strategy;

passport.use(new localStrategy(userModel.authenticate()));

router.get("/",checkAuthenticated, function (req, res, next) {
  res.render("register");
});
router.get("/login",checkAuthenticated, function (req, res, next) {
  res.render("login");
});
router.get("/profile", isLoggedIn,  async function (req, res, next) {
  const user = await  userModel
  .findOne({username:req.session.passport.user})
  res.render("profile",{user});
});
router.get("/home", isLoggedIn, async function (req, res, next) {
  const user = await userModel
  .findOne({username:req.session.passport.user})
  res.render("home",{user});
});

// ALL POST REQUESTS
//REGISTER USER
router.post("/register",  (req, res, next) => {
  const data = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  });

  userModel.register(data, req.body.password).then(() => {
    passport.authenticate("local")(req, res, () => {
      // res.redirect("/profile");
      res.redirect("/home");
    });
  });
});
// LOGIN USER
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    // successRedirect: "/profile",
    successRedirect: "/home",
  })
);

// LOGOUT CODE
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//ISLOGGEDIN FUNCTION
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
// CHECK AUTHENTICATION FOR RESTRICTION OF ROUTES WHICH ARE FOR NON-REGSITERED USER
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return res.redirect('/home'); 
  }
  next();
}
module.exports = router;
