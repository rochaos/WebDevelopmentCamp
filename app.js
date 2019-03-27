var express             = require("express"),
    app                 = express(),
    bodyParser          = require('body-parser'),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    User                = require("./models/user"),
    seedDB              = require("./models/seeds");

var commentRoutes       = require("./routes/comment"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");
    
//call seedDB function to clear everything
// seedDB();

mongoose.connect('mongodb+srv://yelpcamp:Hf3BEChxk6AH2pi@cluster0-melub.mongodb.net/yelp_camp?retryWrites=true',{ useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

app.use(flash());
//Create a session middleware 
app.use(require("express-session")({
    secret:"Mawen is the saddest robot in the universy",
    resave: false,
    saveUninitialized: false
}));
//initialize passport
app.use(passport.initialize());
app.use(passport.session());
//configure passport to use local strategy
passport.use(new LocalStrategy(User.authenticate()));
//encodeing the data and save in the session
passport.serializeUser(User.serializeUser());
//reading session, decode it to retrieve the whole object
passport.deserializeUser(User.deserializeUser());

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


//a middleware to be used for every app
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);  //need to work with router = express.Router({mergeParams: true})

//Tell express to listen (start server)
// the below for use with cloud9
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started!!!");
});