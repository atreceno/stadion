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
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

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

if ('development' == app.get('env')) {
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.errorHandler());
    app.locals.pretty = 'true';
}
if ('production' == app.get('env')) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.use(express.errorHandler());
    app.locals.pretty = 'false';
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

// Socket.io
var data = [
    {text:'learn angular', done:true},
    {text:'build an angular app', done:false}];

io.sockets.on('connection', function (socket) {
    socket.emit('news', data);
    socket.on('news', function (from, msg) {
        console.log('ATO: ', from, msg);
        data = msg;
        socket.broadcast.emit('news', data);
    });

    socket.on('my other event', function (from, msg) {
        console.log('privately: ', from, 'saying', msg);
    });
});

// Start the server
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
