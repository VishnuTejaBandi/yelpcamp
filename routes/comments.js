var express = require("express");
var router = express.Router();
var Campground = require("../models/camp");
var Comment = require("../models/comment");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.render("login");
}

router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, function(err, foundCamp) {
        if (err) {
            console.log(err);
        } else {

            res.render("comments/new", { camp: foundCamp });
        }
    });

});

router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    var comment = req.body.comment;
    var author = req.user;
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            Comment.create({
                text: comment

            }, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log("Created new comment");
                }
                res.redirect('/campgrounds/' + req.params.id);
            });

        }
    });

});

module.exports = router;