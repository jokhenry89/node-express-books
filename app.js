var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
const expressValidator = require('express-validator');

const passport = require('passport');
const flash = require('connect-flash');
var session = require("express-session");
var bodyParser = require("body-parser");
//pasport config


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');


// initialise express
var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// static  directory
app.use(express.static(path.join(__dirname, 'public')));


// connect to db
var mongoose = require('mongoose');
var dev_db_url = 'mongodb+srv://jkette01:Gue55wh0s1n@cluster0-w0njc.mongodb.net/test?retryWrites=true';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// initialise passport middleware
require('./config/passport')(passport);

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,

}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// Now initialise routes after passport is initalises
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);



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


// Express Messages Middleware

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});


module.exports = app;
