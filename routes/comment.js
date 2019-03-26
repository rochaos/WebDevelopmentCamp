var express= require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//ROUTE FOR COMMENT
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp){
        if (err){
            console.log(err);
        } else {
            // console.log(foundCamp);
            res.render("comments/new", {campgrounds:foundCamp});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function (err, foundCamp){
            if (err){
                console.log(err);
            } else {
                Comment.create(req.body.comment, function(err, newComment){
                    if (err){
                        console.log(err);
                    } else {
                        //data from the form + author id and username 
                        newComment.author.id = req.user._id;
                        newComment.author.username = req.user.username;
                        newComment.author.isAdmin = req.user.isAdmin;
                        newComment.save();
                        foundCamp.comment.push(newComment);
                        foundCamp.save();
                        // console.log(foundCamp);
                        // console.log("==========");
                        req.flash("success", "Thanks for your comment! " + req.user.username);
                        res.redirect("/campgrounds/" + req.params.id);
                    }
                });
            }
        });
    });
 
//EDIT ROUTE 
router.get("/:comment_id/edit", middleware.checkCommentID, middleware.CommentOwnership, function (req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err){
            console.log(err);
        } else {
            // console.log(foundCamp);
            res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
        }
    });
});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentID, middleware.CommentOwnership, function (req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            console.log(err);
        } else {
            req.flash("success", "Hi " + updatedComment.author.username + ", your comment had been updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentID, middleware.CommentOwnership, function (req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err, foundComment){
        if (err){
            console.log(err);
        } else {
            req.flash("success", foundComment.author.username + "'s comment has been deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;