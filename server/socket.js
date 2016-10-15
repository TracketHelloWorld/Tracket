module.exports.socketIOinit = socketIOinit;
module.exports.sendRequestToDesktop = sendRequestToDesktop;
module.exports.requestFilesFromClient = requestFilesFromClient;

var db = require('./db');
var socketListeners = {};
var clientListeners = {};
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

    //Browser/Mobile Requests
    socket.on('reqFiles',function(data){
      var client = data["client"];
      var dir = data["dir"];
      var file = data["file"];
      requestFilesFromClient(file, dir, client);
    });

    //Server Requests
    socket.on('fileData',function(data){
      var base64data = data["filedata"];
      var file = data["file"];
      console.log("Base 64:");
      console.log(base64data);
      console.log("-=-=-=-=-=-=-=-=-=-=-=-");
      console.log("file: " + file);
      base64data = base64data.replace(/(\r\n|\n|\r)/gm,"");
      var b = new Buffer(base64data, 'base64')
      console.log(b.toString());
    });
    socket.on('dirData',function(data){
      var dirData = data["syslist"];
      console.log(dirData);
    });

  });
}

function sendRequestToDesktop(type, data, uuid) {
  if (socketListeners[uuid]) {
    socketListeners[uuid].forEach(function(socket) {
      socket.emit(type, data);
    });
  }
}

function requestFilesFromClient(file, dir, uuid) {
  if(socketListeners[uuid]) {
    socketListeners[uuid].forEach(function(socket) {
      var path = dir + file;
      socket.emit("fileReq", {"dir":dir, "file":file});
    });
  }
}
