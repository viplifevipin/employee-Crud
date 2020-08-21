var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
let ObjectID = require('mongodb').ObjectID;
const db=require('../db/db')

/* GET home page. */
// home page view
router.get('/',(req,res)=>{
  res.render('welcome',{title:'w solutions'})
})

// user view with list of name and roles
router.get('/index', function(req, res, next) {
  db.get().collection('employees').find().toArray(function (err,docs){

    res.render('index', { list:docs });
    console.log(docs)
  })
});


module.exports = router;
