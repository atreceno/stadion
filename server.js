/**
 * We are trying to follow here some unofficial Node.js style guides [http://nodeguide.com/style.html] and framework's
 * specific good practices. For example, we are not using app.configure() to configure express because the method
 * remains for legacy reasons and it is not required [http://expressjs.com/api.html]. Info about package.json values
 * can be found [package.json.nodejitsu.com]
 */
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

// Schema and model definition before routing
console.log('Bootstrapping the model with mongoose version: %s', mongoose.version);
require('./app/models/country');
require('./app/models/sport');

// Routes definition after bootstrapping the model
console.log('Bootstrapping the routes');
var routes = require('./app/routes/index');
var country = require('./app/routes/country');

// Load configuration according to the environment. Note app.set('env', process.env.NODE_ENV || 'development');
console.log('Loading configuration for %s environment', app.get('env'));
var config = require('./config/credentials')[app.get('env')];

// Connect to DB [see http://mongoosejs.com/docs/connections.html]
console.log('Connecting to DB: %s', config.db.uri);
mongoose.connect(config.db.uri, config.db.options, function (err) {
    if (err) throw err;
    console.log('Connection to DB established');
});

// Express configuration for all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Note app.get('env') is initialized to process.env.NODE_ENV ||
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    app.locals.pretty = 'true';
}

// Map partial views for Angular.js
app.get('/partials/:name', routes.partials);

// Offer REST API
app.get('/', routes.index);
app.get('/api/countries', country.findAll);
app.get('/api/countries/:id', country.findOne);
app.post('/api/countries', country.addNew);
app.put('/api/countries/:id', country.modify);
app.delete('/api/countries/:id', country.delete);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
