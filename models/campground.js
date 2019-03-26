var mongoose = require("mongoose");

var camgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    comment:[
        {
            // save the ref ID into type
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String,
        isAdmin: Boolean
    }
});

module.exports= mongoose.model("Campground", camgroundSchema);