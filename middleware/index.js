//all the middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCamp) {
            if (err){
                req.flash("error", "Cannot find the Campground");
                res.redirect("back");
            } else {
                if (foundCamp.author.id.equals(req.user._id)||req.user.isAdmin){
                    return next();
                } else {
                    req.flash("error", "You don't have permission to edit this");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("/login");
    }
};

middlewareObj.CommentOwnership = function (req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err){
                req.flash("error", "Cannot find the comment");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)||req.user.isAdmin){
                    return next();
                } else {
                    req.flash("error", "You don't have permission to edit this");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("/login");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect ('/login');
};

middlewareObj.checkCampID = function(req, res, next){
    Campground.findById(req.params.id, function(err, foundCamp){
        if (err || !foundCamp){
            console.log(err);
            req.flash("error", "Sorry the campground does not exist!");
            res.redirect('/campgrounds');
        } else {
            return next();
        }
    });
};

middlewareObj.checkCommentID = function(req, res, next){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err || !foundComment){
            console.log(err);
            req.flash("error", "Sorry the comment does not exist!");
            res.redirect('/campgrounds/' + req.params.id);
        } else {
            return next();
        }
    });
};

module.exports = middlewareObj;