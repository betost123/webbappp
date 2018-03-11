var express    = require('express')
var app        = express()
var passport   = require('passport')
var session    = require('express-session')
var bodyParser = require('body-parser')
var env        = require('dotenv').load()
var exphbs     = require('express-handlebars')
var multer     = require('multer');

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


 // For Passport
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//To access static css files
app.use(express.static('app/public'))

 //View enginge setup
app.set('views', './app/views')
app.engine('html', exphbs({extname: '.html'}));
app.set('view engine', 'html');

//View start page when server starts
app.get('/', function(req, res){
  res.render('home', {text: 'Your BOPO on the Web'});
});

//Models
var models = require("./app/models");

//Routes
var router = require('./app/routes/router.js')(app,passport);


//Code for uploading image and putting in folder Images.
/*
var Storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./Images");
  },
  filename: function(req, file, callback) {
    callback(null, file.filename + "_" + Date.now() + "_" + file.originalname);
  }
});

var upload = multer ({
  storage : Storage
}).array("imgUploader", 3); //field name and max cunt

app.get("/settings", function(res, req) {
  res.sendFile(__dirname + "/settings.html");
});
 app.post("/api/Upload", function(req, res) {
     upload(req, res, function(err) {
         if (err) {
             return res.end("Something went wrong!");
         }
         //res.render('ourimages');
         //return res.end("File uploaded sucessfully!.");
     });
 }); */

//load passport strategies
require('./app/config/passport/passport.js')(passport,models.user);


//Sync Database
models.sequelize.sync().then(function(){
console.log('Nice! Database looks fine')

}).catch(function(err){
console.log(err,"Something went wrong with the Database Update!")
});



app.listen(5000, function(err){
if(!err)
console.log("Listening at port 5000"); else console.log(err)

});
