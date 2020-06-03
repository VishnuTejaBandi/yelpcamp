var express = require("express");
var router = express.Router();
var Campground = require("../models/camp")
var checkCampOwnership = require("../middleware").checkCampOwnership;
var isLoggedIn = require("../middleware").isLoggedIn;



var searchedCamps;
router.get("/campgrounds", function(req, res) {
    console.log(searchedCamps);
    if(!searchedCamps)
    {
        Campground.find({}, function(err, allCamps) {
            if (err) {
                console.log(err);
            } else {
                res.render("camps/index", { camps: allCamps });
            }
        });
    }
    else
    {
        res.render("camps/index", { camps: searchedCamps });
        foundCamps=null;
    }

});

router.post('/campgrounds', isLoggedIn, (req, res) => {
    console.log(req.body);

    if(req.body.search==0) res.redirect("/campgrounds");
    else if(!req.body.search)
    {
        var name = req.body.name;
        var image = req.body.image;
        var description = req.body.description;
        var location = req.body.location;
        Campground.create({ name: name, image: image, description: description,location:location, author: { id: req.user._id, username: req.user.username } },
            function(err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("New Camp created");
                    req.flash("info", "Successfully created the campground " + campground.name)
                    res.redirect('/campgrounds');
                }
            }
        )
    }
    else
    {
        var searchQuery = req.body.search;
        var mongoQuery = {$or:[{"location":searchQuery },{"name":searchQuery},{"description":searchQuery}]};
        console.log(mongoQuery);
        Campground.find(mongoQuery,function(err, foundCamps) {
            if (err) {
                console.log(err);
            } else {
                searchedCamps = foundCamps;
                res.redirect("/campgrounds");
            }
        }); 
    }

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



router.get('/campgrounds/:id/edit', checkCampOwnership, (req, res) => {

    Campground.findById(req.params.id, function(err, foundCamp) {
        res.render("camps/edit", { camp: foundCamp });
    });
});


router.put('/campgrounds/:id/', checkCampOwnership, (req, res) => {
    console.log("Edited a camp");
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCamp) {
        if (err) {

        } else {
            req.flash("info", "You edited the campground" + updatedCamp.name)
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/campgrounds/:id', checkCampOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, req.body.camp, function(err, updatedCamp) {
        if (err) {

        } else {
            req.flash("info", "You removed the campground " + updatedCamp.name)
            res.redirect('/campgrounds/');
        }
    });
});



module.exports = router;