/*
* index.js
*
* INSERT_NAME_HERE Backend Server Main File
*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socketHandler = require('./socket');
var bodyParser = require('body-parser');
var db = require('./db');
var controls = require('./controls');
var fs = require("fs");
var auth = require('./auth');
var config = require('./config');

db.initializeDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('trust proxy', 1);
var cookieSession = require('cookie-session');
var path = require('path').dirname(require.main.filename);
var publicPath = path + "/public/";
app.use(cookieSession({
  name: 'session',
  keys: config.keys
}));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://nisarg.me:1337');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

socketHandler.socketIOinit(io);

app.get('/', function (req, res) {
  if(req.session.user != null)
  {
    res.sendFile(publicPath + "dash.html");
  }
  else
  {
    res.sendFile(publicPath + "index.html");
  }
});

app.post('/sendinfo/:mac', function(req, res) {
  res.send("json");
  socketHandler.onEventFromDesktop("status",parseIncomingJSONFromDesktop(req.body),req.params.mac);
});

app.post('/sendtasks/:mac', function(req, res) {
  res.send("json");
  socketHandler.onEventFromDesktop("tasks",parseIncomingJSONFromDesktop(req.body),req.params.mac);
});

app.get('/getmac', function(req, res){
  if(req.session.user != null)
  {
    db.getCurrentUserId(req,function(userId){
      if(userId == null)
      {
        res.send("error");
        return;
      }
      else {
        db.where("computers","userId",userId,function(results){
          if(results != null)
          {
            res.send(results[0].mac);
          }
          else {
            res.send("none");
          }
        });
      }
    });
  }
  else {
    res.send("error");
  }

});

function parseIncomingJSONFromDesktop(rawjson)
{
  var innerJSON = rawjson.json_payload;
  return innerJSON;
}

app.get('/test', function(req, res) {
  res.sendFile(path + "/sockettest.html");
});

app.get('/getpcs', function(req, res){

});

app.get('/css/:file', function (req, res) { sendFolder("css",req,res); });
app.get('/images/:file', function (req, res) { sendFolder("images",req,res); });
app.get('/js/:file', function (req, res) { sendFolder("js",req,res); });
app.get('/files/:file', function (req, res) { sendFolder("files",req,res); });

function sendFolder(folder,req,res)
{
  var fileId = req.params.file;
  var file = publicPath + folder + "/" + fileId;
  if(fs.existsSync(file))
  {
    res.sendFile(file);
  }
  else {
    res.send("404 not found.");
  }
}

app.post('/register', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    auth.registerUser(username,password,function(){
      res.send("success");
    },function(error){
      var response = {
        error: error
      }
      res.send(JSON.stringify(response));
    });
});

app.get('/pcauth/:username/:password/:mac/:title', function(req, res) {
  var username = req.params.username;
  console.log("username: " + username);
  var password = req.params.password;
  var mac = req.params.mac;
  var title = req.params.title;
  auth.authenticateComputer(username,password,title,mac,function(msg){
    res.send(msg);
  });
});

app.get('/command/:mac', function(req, res){
  var cmdInfo = controls.command;
  controls.getCommand(req.params.mac,res);
});

app.post('/sendcommand/:mac', function(req, res){
  controls.cmd(req.body.command);
  res.send("true");
});

app.post('/sendkill/:mac', function(req, res){
  console.log(req.body);
  controls.kill(req.body.pid,req.params.mac,res);
});

app.post('/auth', function(req, res) {
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  auth.loginUser(username,password,req,function(msg){
    res.end(msg);
  });
});

app.get('/signout', function(req, res) {
  req.session.user = null;
  res.redirect('/');
});

var expserv = http.listen(1337, function () {
  console.log('Spexy Server!');
});
