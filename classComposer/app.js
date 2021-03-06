// Requires \\
var express = require('express');
var bodyParser = require('body-parser');
// console.log = function(){}
// Connect to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/classComposerDb')

// Auth Requires
var session = require('express-session');
var passport = require('passport');

var passportConfig = require('./config/passport'); // Load in our passport configuration that decides how passport actually runs and authenticates

// Create Express App Object \\
var app = express();

// Session Setup
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: false
}));

// Hook in passport to the middleware chain
app.use(passport.initialize());

// Hook in the passport session management into the middleware chain.
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

// Application Configuration \\
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes \\
var authenticationController = require('./controllers/authentication');
var loggedInCtrl 	= require('./controllers/loggedInCtrl');
var schoolCtrl 		= require('./controllers/schoolCtrl')

// This wil point to the Loged-out home page
app.get('/', function(req, res){
	console.log('in / route')
 	res.sendFile('/html/index.html', {root : './public'})
});

// Our get request for viewing the login page
app.get('/auth/login', authenticationController.login);

// Post received from submitting the login form
app.post('/auth/login', authenticationController.processLogin);

// Post received from submitting the signup form
app.post('/auth/signup', authenticationController.processSignup);

// Any requests to log out can be handled at this url
app.get('/auth/logout', authenticationController.logout);

// This route is designed to send back the logged in user (or undefined if they are NOT logged in)
app.get('/api/me', function(req, res){
	res.send(req.user)
})

app.get('/data/grade'), 

// ***** IMPORTANT ***** //
// By including this middleware (defined in our config/passport.js module.exports),
// We can prevent unauthorized access to any route handler defined after this call
// to .use()
app.use(passportConfig.ensureAuthenticated);

// routing between pages
app.get('/loggedIn/home.html',loggedInCtrl.getLoggedInHome)
app.get('/loggedIn/settings.html', loggedInCtrl.getLoggedInSettings)

// accessing data from the database
app.post('/data/initializeSchool', schoolCtrl.initializeSchool)
app.get('/data/getSchool', schoolCtrl.getSchool)
app.post('/data/updateSchool', schoolCtrl.updateSchool)
app.get('/data/currentTeachers', schoolCtrl.currentTeachers)
app.post('/data/newTeacher', schoolCtrl.addTeacher)
app.get('/data/getStudents', schoolCtrl.getStudents)



// Creating Server and Listening for Connections \\
var port = 3000
app.listen(port, function(){
  console.log('Server running on port ' + port);
});
