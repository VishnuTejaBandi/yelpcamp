var express = require("express"),
    app = express(),
    bp = require('body-parser'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    seedDb = require("./seeds");
// Passport Configuration

app.use(require("express-session")({
    secret: "Vishnu Teja bandi",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: true }));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var campRoutes = require("./routes/camps"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// seedDb();



app.use(function(req, res, next) {
    res.locals.currentUser = req.user;

    next();
});


app.use(commentRoutes);
app.use(campRoutes);
app.use(indexRoutes);

// ***********************************************************************

app.listen(80, "192.168.43.153", function() {
    console.log("The server has started")
});