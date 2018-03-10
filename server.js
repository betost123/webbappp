var express    = require('express')
var app        = express()
var passport   = require('passport')
var session    = require('express-session')
var bodyParser = require('body-parser')
var env        = require('dotenv').load()
var exphbs     = require('express-handlebars')

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


 // For Passport
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


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
var authRoute = require('./app/routes/auth.js')(app,passport);

//PUBLIC - Used for static resources (must have first arg, to make path absolute)
app.use('/public', express.static(path.join(__dirname, '/public')));

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
