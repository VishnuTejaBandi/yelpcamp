var express = require("express");
var router = express.Router();

var Campground = require("../models/camp")

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.render("login");
}
router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCamps) {
        if (err) {
            console.log(err);
        } else {
            res.render("camps/index", { camps: allCamps });
        }
    })


});
router.get('/campgrounds/new', isLoggedIn, (req, res) => {
    res.render("camps/new");
});



router.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("camps/show", { camp: foundCamp });
        }
    });

});


router.post('/campgrounds', isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    Campground.create({ name: name, image: image, description: description, author: { id: req.user._id, username: req.user.username } },
        function(err, campground) {
            if (err) {
                console.log(err);
            } else {
                console.log("New Camp created");
            }
        }
    )
    res.redirect('/campgrounds');
});
module.exports = router;