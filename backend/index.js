// index.js

// BASE SETUP
// =============================================================================
var express    = require('express');        // call express
var app        = express();                 // define our app using express

var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var mongo = require('mongodb');
var port = process.env.PORT || 8080;        // set our port
var router = express.Router();

//var conn = mongoose.createConnection("mongodb://localhost");

// Set routes
var loginRoutes  = require('./app/routes/login');
var portalRoutes = require('./app/routes/portal');

app.use(function (request, response, next) {
    console.log('init middleware');
    next();
});

// Configure app to use Body Parser
// Use to fetch data from a POST request
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.set('view engine', 'ejs');

// Set up mongo connection
//mongoose.connect('mongodb://localhost/VIM');

// Use Express to handle routes
app.use('/login', loginRoutes);
app.use('/portal', portalRoutes);


// START THE SERVER
// =============================================================================
app.listen(port, () => console.log('Server listening on port ' + port));
