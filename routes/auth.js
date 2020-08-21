var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
let ObjectID = require('mongodb').ObjectID;
var User=require('../models/user')



//admin signup view

router.get("/signup", function(req, res){
    res.render("user/signup");
});



//handle admin sign up logic
router.post("/signup", function(req, res){
    if(req.body.code==='mycode'){
        console.log('he is admin')
    }else {
        res.render('/','code err')
    }

    var newUser = new User({username: req.body.email});
    if(req.body.code === 'mycode') {

        newUser.isAdmin = true;
    }



    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("user/signup", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
            res.redirect('/employee/list')
        });
    });
console.log(newUser)
});

//admin sign in view router

router.get('/signin',(req,res)=>{res.render('user/signin')})

//admin signin post router
router.post('/signin',(req,res,next)=>{

    const {email} = req.body
    let errorss = []
    passport.authenticate('local', (err, user, info)=> {
        if (err) { return next(err); }

        if(!user){
            console.log(req.body)
            errorss.push({msg:'Email or password is incorrect'})
            console.log(errorss)
            return res.render('user/signin', {errorss, email})
        }

        req.logIn(user, (err)=> {
            if (err) { return next(err); }
            res.redirect('/employee/list')
        })
    })(req, res, next)


})


module.exports=router;