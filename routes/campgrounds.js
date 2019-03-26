var express= require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); //will auto require index.js

//INDEX
router.get("/", function(req, res){
    // cannot directly use campgroundDB = Campground.find(), need to add function (err, allcamp) and use allcamp as an object
    Campground.find({}, function(err, allcamp){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allcamp});
        }
    });
});
// form for new
router.get("/new",middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});
// POST new form
router.post("/",middleware.isLoggedIn, function(req, res){
    //to match the format
    var author = {
        id: req.user._id,
        username: req.user.username,
        isAdmin: req.user.isAdmin
    };
    var newCamps = {name: req.body.newCamp, image: req.body.newImg, description: req.body.newDes, price:req.body.newPrice, author: author};
    Campground.create(newCamps, function(err, camp){
        if (err){
            console.log(err);
        } else {
            console.log("The following campground had been added to our database!");
            console.log(camp);
            //redirect has to be put inside the if-else, otherwise js don't know for the change
            req.flash("success", "Awesome, you had submitted a new Campground!");
            res.redirect("/campgrounds");
        } 
    });
});
//SHOW DETAILS
router.get("/:id",middleware.checkCampID, function(req, res) {
    Campground.findById(req.params.id).populate("comment").exec(function(err, foundCamp){
        if (err){
            console.log(err);
        } else {
            // console.log(foundCamp);
            res.render("campgrounds/show", {campgrounds:foundCamp});
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit",middleware.checkCampID, middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp){
        if (err){
            console.log(err);
        } else {
            // console.log(foundCamp);
            res.render("campgrounds/edit", {campgrounds:foundCamp});
        }
    });
});

//UPDATE ROUTE
router.put("/:id",middleware.checkCampID, middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.Camp, function(err, updatedCamp){
        if (err){
            res.send("Something goes wrong");
        } else {
            req.flash("success", updatedCamp.name + " had been updated!");
            res.redirect("/campgrounds");
        }
    });
});


//DESTROY ROUTE
router.delete("/:id",middleware.checkCampID, middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if (err){
            console.log("Something goes wrong");
        } else {
            foundCamp.comment.forEach(function(commentID){
                Comment.findByIdAndDelete(commentID, function(err, updatedComment){
                    if (err){
                        console.log("Something goes wrong");
                    }
                });
            });
            Campground.findByIdAndDelete(req.params.id, function(err){
                if (err){
                    console.log(err);
                } else {
                    req.flash("success", foundCamp.name + " had been deleted!");
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});

module.exports = router;