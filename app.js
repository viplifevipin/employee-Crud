var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport=require('passport')
var expressHbs=require('express-handlebars')
var db=require('./db/db')

var LocalStrategy = require("passport-local")
var flash        = require("connect-flash")
var User        = require("./models/user")
var Employee       = require("./models/employee")
var session = require("express-session")


var indexRouter = require('./routes/index');
var authRouter=require('./routes/auth')
var userRouter=require('./routes/user')
var employeeRouter=require('./routes/employee')
var app = express();

// view engine setup
app.engine('.hbs', expressHbs({
  extname: '.hbs',
  defaultLayout: 'layout',
  partialsDir: path.join(__dirname, 'views/partials'),
  layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', '.hbs');
app.set('views',path.join(__dirname,'views'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require("express-session")({
  secret: "macho",
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
  usernameField: 'email',
},User.authenticate(),Employee.authenticate()));

passport.use('employee',new LocalStrategy({
  usernameField: 'email',
},Employee.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
  res.locals.signin = req.isAuthenticated()
  res.locals.session= req.session
  next()
})

app.use('/', indexRouter);
app.use('/auth',authRouter)
app.use('/employee',employeeRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


db.connect(function (error) {

  if (error){
    console.log('Unable to connect database');
    process.exit(1);
  } else {
    console.log(' Database connecetd successfully...');
  }

});

module.exports = app;
