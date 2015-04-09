/**
 * Created by andywalpole on 19/04/2014.
 */
'use strict';
// set up ========================
var express = require('express');
var http = require('http');
http.globalAgent.maxSockets = Infinity;
var path = require('path');
var morgan = require('morgan');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var compress = require('compression');
var app = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var sixMonths = 14515200;

var conf = require('./server/config/prerender'); 			// load the prerender config
app.use(require('prerender-node').set('prerenderToken', conf.prerender));
app.use(helmet.frameguard('deny'));
app.use(helmet.xssFilter());
app.use(helmet.nosniff());
app.use(helmet.hidePoweredBy());

if (app.get('env') === 'production') {
  app.use(helmet.hsts({maxAge: 15552000}));
}

var database = require('./server/config/database'); 			// load the database config

// configuration ===============================================================
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev')); 						// log every request to the console
app.use(compress());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride()); 						// simulate DELETE and PUT
app.use(cookieParser());

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

/*
 * Development Settings
 */
if (app.get('env') === 'development') {

  app.all('*', function (req, res, next) {
    res.header('Cache-Control', 'no-cache');
    next();
  });

  // This will change in production since we'll be using the dist folder
  // This covers serving up the index page
  app.use(favicon(path.join(__dirname, 'app/favicon.ico')));
  app.use(express.static(path.join(__dirname, 'app'))); 		// set the static files location /public/img will be /img for users

  // Error Handling
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


/**
 * Production Settings
 */
if (app.get('env') === 'production') {

  app.use(favicon(path.join(__dirname, 'dist/favicon.ico')));

  app.all('*', function (req, res, next) {
    res.header('Cache-Control', 'no-cache');
    next();
  });

  app.all('/blog-admin/*', function (req, res, next) {
    res.header('Cache-Control', 'no-store');
    next();
  });

  app.all('/scripts/*', function (req, res, next) {
    res.header('Cache-Control', 'public, max-age=' + sixMonths);
    next();
  });

  app.all('/images/*', function (req, res, next) {
    res.header('Cache-Control', 'public, max-age=' + sixMonths);
    next();
  });

  app.all('/styles/*', function (req, res, next) {
    res.header('Cache-Control', 'public, max-age=' + sixMonths);
    next();
  });

  app.use(express.static(path.join(__dirname, 'dist')));

  // set the static files location /public/img will be /img for users

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

// routes ======================================================================
require('./server/routes/user_routes.js')(app);
require('./server/routes/blog_routes.js')(app);
require('./server/routes/comment_routes.js')(app);
require('./server/routes/misc_routes.js')(app);
require('./server/routes/newsblurAPI.js')(app);

//RSS feed parsing
require('./server/parse_feed/parse_rss.js')(app);

// XML sitemap =================================================================
require('./server/sitemap.js')(app);

require('./server/rss.js')(app);

module.exports = app;

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
