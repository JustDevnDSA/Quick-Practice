var express = require("express");
var router = express.Router();
const userModel = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

passport.use(new localStrategy(userModel.authenticate()));

router.get("/", isAuthorised,function (req, res, next) {
  res.render("register");
});

router.get("/login",isAuthorised, function (req, res, next) {

    res.render("login");
});

router.get("/home",isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user})
  res.render("home",{user});
});

router.get("/profile",isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user})
  res.render("profile",{user});
});

//REGISTER
router.post("/register", (req, res, next) => {
  const data = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  });

  userModel.register(data, req.body.password)
  .then(() => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  }).catch((err)=>{
      res.redirect('/')
  })

});

// LOGIN
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/home",
  })
);

// LOGOUT
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// IsLoggedIn function ==> for registered users
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

// IsAuthorised function ==> for non-registered users
function isAuthorised(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  next();
}

module.exports = router;
