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


var EmployeeSchema = new mongoose.Schema({
    username:{
        type: String,
    },
    fullName:{
        type: String,
    },
    role:{
        type: String,
    },
    city:{
        type: String,
    },
    password:{
        type: String,
    }



});

EmployeeSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Employee",EmployeeSchema);