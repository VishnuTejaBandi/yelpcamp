var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");


router.get("/", function(req, res) {
    res.render("landing");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.render("login");
}

router.post('/register', (req, res) => {

    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect('/campgrounds');
        });
    });
});
router.post('/login', passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {});

router.get('/register', (req, res) => {
    res.render("register");
});

router.get('/login', (req, res) => {
    res.render("login");
});
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/campgrounds');
});
module.exports = router;