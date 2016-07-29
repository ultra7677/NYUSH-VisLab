var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');

// mongoDB
var mongoose = require('mongoose');
require('./models/Posts');
require('./models/Comments');
require('./models/AuthForm');
mongoose.connect('mongodb://localhost/news');


// sqlite

/*
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('vislab');


db.serialize(function() {

  db.run('CREATE TABLE lorem (info TEXT)');
  var stmt = db.prepare('INSERT INTO lorem VALUES (?)');

  for (var i = 0; i < 10; i++) {
    stmt.run('Ipsum ' + i);
  }

  stmt.finalize();

  db.each('SELECT rowid AS id, info FROM lorem', function(err, row) {
    console.log(row.id + ': ' + row.info);
  });
});

db.close();
*/

// create the db file
var fs = require('fs');
var file = 'vislab.db';
var exists = fs.existsSync(file);

if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

// Connect db
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE Stuff (thing TEXT)");
    db.run("CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL)");
  }

  // check same username
  //var username = "Ultra";
  //db.each("SELECT * FROM user WHERE username = '" + username + "'" , function (err,rows) {
    //console.log(rows.username);
    //console.log(err);
  //});

  /*
  var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");
  // Insert random data
  var rnd;
  for (var i = 0; i < 10; i++) {
    rnd = Math.floor(Math.random() * 10000000);
    stmt.run("Thing #" + rnd);
  }

  stmt.finalize();

  // Query
  db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
    console.log(row.id + ": " + row.thing);
  });
  */
});

db.close();


var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// run python script
var pyshell = new PythonShell('my_script.py');

// sends a message to the Python script via stdin
pyshell.send('hello');

pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
});

// end the input stream and allow the process to exit
pyshell.end(function (err) {
    if (err) throw err;
    console.log('finished');
});
// error handlers

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
