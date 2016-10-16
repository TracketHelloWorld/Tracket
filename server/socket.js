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
      requestFilesFromClient(file, dir, client, socket);
    });

  });
}

function requestFilesFromClient(file, dir, uuid, clientSocket) {
  if(socketListeners[uuid]) {
    socketListeners[uuid].forEach(function(socket) {
      var path = dir + file;
      socket.emit("fileReq", {"dir":dir, "file":file});
      socket.on('fileData',function(data){
        var base64data = data["filedata"];
        var filename = data["file"];
        console.log("Base 64:");
        console.log(base64data);
        console.log("-=-=-=-=-=-=-=-=-=-=-=-");
        console.log("file: " + filename);
        var decodedData = fileHandler.decodeBase64(base64data);
        fileHandler.writeDataToUserClientFile(uuid, filename, decodedData);
        clientSocket.emit("fileReady",{"url":"http://159.203.126.117:6969/getFile/" + uuid + "/" + filename});
      });
      socket.on('dirData',function(data){
        var dirData = data["syslist"];
        console.log(dirData);
      });
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
