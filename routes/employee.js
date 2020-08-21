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




//user sign in get route
router.get('/signin',(req,res)=>{
    res.render('adduser/signin')
})


//showing the list of users with roles that assigned by the admin
router.get('/list', async (req,res)=> {
    Employee.find({employees:req.params._id}).sort({ date: -1 })
        .lean()
        .then(employee => {
            res.render('employee/adminview',{ employee: employee })
        })

})

//routes to get the user adding window
router.get('/edit',(req,res)=>{
    res.render('employee/addOrEdit')
})

//route to add a new user
router.post('/edit',(req,res)=>{
    var newEmployee=new Employee({username:req.body.email,role:req.body.role,fullName:req.body.fullName,  city:req.body.city});
    Employee.register(newEmployee,req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.render("employee/addOrEdit", {error: err.message});
        }
        passport.authenticate("employee")(req, res, function(){
            res.redirect('/employee/list')
        });
    })
})

//route to sign in as a user with passport local strategy
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

// router.get('/edit:id',async (req,res)=> {
//         Employee.findOneAndUpdate({employees: req.params.id}).sort({date: -1})
//             .lean()
//             .then(employee => {
//                 res.render('employee/addOrEdit', {employee: employee})
//             })
//     }
// )

//route to delete the user only for admins

router.get('/delete:id', (req,res)=>{

    Employee.findOneAndDelete(req.params.id,(err)=>{
        if (!err){
            res.redirect('/employee/list')
        }
        else {
            console.log('err',err)
        }
    })
})


module.exports = router;