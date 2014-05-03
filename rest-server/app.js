var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cs = require('cansecurity'), cansec;

var routes = require('./routes/index');
var users = require('./routes/users');
var restaurants = require('./routes/restaurants');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var user = {name:"john",pass:"1234",age:25};
cansec = cs.init({
    validate: function(login,password,callback){
        if (user.name !== login) {
            // no such user - ERROR
            callback(false,null,"invaliduser");
        } else if (password === undefined) {
            // never asked to check a password, just send the user - GOOD
        callback(true,user,user.name,shaHash(pass));
        } else if (user.pass !== pass) {
            // asked to check password, but it didn't match - ERROR
            callback(false,null,"invalidpass");
        } else {
            // user matches, password matches - GOOD
            callback(true,user,user.name,shaHash(pass));
        }
    },
    sessionKey: 'SESSIONKEY'
});

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: "agf67dchkQ!"}));
app.use(cansec.validate);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/restaurants', restaurants);

app.get('/public', function(req, res) {
    res.type('text/plain');
    res.send('hello public');
});

app.get('/secure', cansec.restrictToLoggedIn, function(err, req, res) {
    if (err) {
        /*console.log('error status : ' + err.status);
        console.log('error type : ' + err.type);*/
        res.send(err);
    }
    res.type('text/plain');
    res.send('hello secure');
});

app.use(function(req, res, next){
    res.status(404);
    //log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    //log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

/// catch 404 and forwarding to error handler
/*app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});*/

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
