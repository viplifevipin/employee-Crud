var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var  {check,validationResult}=require('express-validator')
let ObjectID = require('mongodb').ObjectID;

mongoose.connect('mongodb://localhost:27017/mine',{ useNewUrlParser: true,useUnifiedTopology: true },(err)=>{
    if (err){
        throw err
    }
    else {
        console.log('done')
    }
})


var Employee=require('../models/employee')





router.get('/signin',(req,res)=>{
    res.render('adduser/signin')
})

router.get('/list', async (req,res)=> {
    Employee.find({employees:req.params._id}).sort({ date: -1 })
        .lean()
        .then(employee => {
            res.render('employee/adminview',{ employee: employee })
        })

})

router.get('/edit',(req,res)=>{
    res.render('employee/addOrEdit')
})

router.post('/edit',(req,res)=>{
    var newEmployee=new Employee({username:req.body.email,role:req.body.role,fullName:req.body.fullName,  city:req.body.city});
    Employee.register(newEmployee,req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.render("user/signup", {error: err.message});
        }
        passport.authenticate("employee")(req, res, function(){
            res.redirect('/employee/list')
        });
    })
})

router.post('/signin',(req,res)=>{
    const {email} = req.body
    let errorss = []
    passport.authenticate('employee', (err, user, info)=> {
        if (err) { return (err); }

        if(!user){
            console.log(req.body)
            errorss.push({msg:'Email or password is incorrect'})
            console.log(errorss)
            return res.render('user/signin', {errorss, email})
        }

        req.logIn(user, (err)=> {
            if (err) { return (err); }
            res.redirect('/index')
        })
    })(req, res)
})


module.exports = router;