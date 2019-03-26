var express= require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//========
//Auth Routes
//========
router.get("/", function(req, res){
    res.render("campgrounds/landing");
});
//register
router.get('/register', function(req, res){
    res.render('register');
});

router.post('/register', function(req, res){
    User.register(new User({username:req.body.username}), req.body.password, function(err, newuser){
        if (err){
            req.flash("error", err.message);
            return res.redirect('/register');
        } 
        var upgradeCode = 'OK';
        if (req.body.adminCode === upgradeCode){
            User.findByIdAndUpdate(newuser._id, {isAdmin:true}, function(err){
                if (err){
                    console.log(err);
                }
            });
        } 
            //log the user in
            passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + newuser.username);
            res.redirect('/campgrounds');
        });
    });
});
//login
router.get('/login', function(req, res){
    res.render('login');
});
router.post('/login', function(req, res, next){
   passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
        req.flash("error", 'Login fail');
        return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      if (user.isAdmin){
      req.flash("success", "Welcome back, " + user.username + ", you are an admin");
      } else {
          req.flash("success", "Welcome back, " + user.username);
      }
      return res.redirect('/campgrounds');
    });
  })(req, res, next);
});

//logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash("success", "You had logged out");
    res.redirect('/');
});



module.exports = router;