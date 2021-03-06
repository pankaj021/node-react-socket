var express = require('express');
var path = require('path');
var http  = require('http')
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const socketIo = require('socket.io')

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

const server = http.createServer(app)
const io = socketIo(server)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

var port = 3000
app.set('port', port);

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('message', function(msg){
    console.log('message: ' + msg);
    io.emit('message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
})

server.listen(port)
module.exports = app;
