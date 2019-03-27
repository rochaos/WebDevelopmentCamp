# Made with node.js and bootstrap 4
# Basic Function
* Show a landing page with animated pictures as background
* Show a index page of all (fake) campgrounds in MongoDB
* Show details of selected campground with comment submitted by other user
* Submit and edit of camngrounds

# Authentication function
* Register and login of Users
* Only register user can submit
* Normal users can only edit/delete his/her data
* Admin User can edit/delete other user's data 

# Features to be added in
* Add location property
* Google map API to show the actual location
# V13 Delpyed version covers

# Deploy to heroku
* Add start scripts in package.json
* 'heroku logs' to show logs
* 'heroku run ls' to ls on heroku server
* 'heroku run npm install mongoose --save' to install npm on heroku

# Connect to MongoDB Atlas
* Follow induction on https://www.udemy.com/the-web-developer-bootcamp/learn/v4/questions/6345892

# Environment Variables
* Example
    (process.env.PORT, process.env.IP), dynamic based on environment
* Create Database url
    For c9
    $ export DATABASEURL = mongodb://localhost/yelp_camp_v13
    For heroku
    go to heroku dashboard, setting, set for Config Vars
    or $ heroku config:set DATABASEURL = xxxxx
* Use Database URL
    process.env.DATABASEURL


