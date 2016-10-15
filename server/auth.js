//user and computer authentication

module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
module.exports.authenticateComputer = authenticateComputer;

var db = require('./db');
var pw = require('password-hash');
var randomstring = require("randomstring");

//registers a user through the web interface
function registerUser(username,password,successCallback,failCallback)
{
  if(password && username)
  {
    db.checkExists('users','username',username,function(){
      //does not exist
      var userInfo = {
        username: username,
        password: pw.generate(password)
      };
      console.log(JSON.stringify(userInfo));

      db.insert("users",userInfo,function(){
        successCallback();
      },function(){
        failCallback("An internal error occured. Try again later.");
      });

    },function(){
      //exists
      failCallback("Username already exists.");
    });
  }
  else {
    failCallback("Please fill out the entire form.");
  }
}

//logs a user into the web interface with a session token
function loginUser(username,password,req,callback)
{
  var resultData = {
    success: false,
    message: "Unknown error."
  }
  if(password && username)
  {
    var userData = db.where("users","username",username,function(result) {
      if(result != null)
      {
        if(pw.verify(password,result[0].password))
        {
          req.session.user = result[0].username;
          resultData.success = true;
          resultData.message = "";
        }
        else {
          resultData.message = "Invalid password.";
        }
      }
      else {
        resultData.message = "User does not exist.";
      }
      callback(JSON.stringify(resultData));
    });
  }
  else {
    resultData.message = "Please fill out the form entirely.";
    callback(JSON.stringify(resultData));
  }

}

//authenticates a computer and returns a computer token
function authenticateComputer(username,password,title,mac,callback)
{
  var resultData = {
    success: false,
    message: "An error occured. Please make sure you have entered all of your registration information correctly."
  }
  var userData = db.where("users","username",username,function(result) {
    if(result != null)
    {
      if(pw.verify(password,result[0].password))
      {
        db.checkExists("computers","mac",mac,function() {
          var pctoken = randomstring.generate(32).toLowerCase();
          var computerInfo = {
            name: title,
            mac: mac,
            token: pctoken,
            userId: result[0].id
          };
          console.log("computer info:");
          console.log(JSON.stringify(computerInfo));
          db.insert("computers",computerInfo,function(){
            callback(true);
          },function(){
            callback(false);
          });
        }, function() {
          db.where("computers","mac",mac,function(result) {
            callback(true);
          });
        })
      }
      else {
        callback(false);
      }
    }
    else {
      callback(false);
    }
  });
}

function getUserComputers(req,res)
{
  if(req.session.user != null)
  {
    res.send()
  }
  else {
    res.send("error");
  }
}
