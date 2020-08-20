var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect('mongodb://localhost:27017/mine',{ useNewUrlParser: true,useUnifiedTopology: true },(err)=>{
    if (err){
        throw err
    }
    else {
        console.log('done')
    }
})


var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);