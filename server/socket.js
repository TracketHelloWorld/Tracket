module.exports.socketIOinit = socketIOinit;
module.exports.listenForMac = listenForMac;
module.exports.onEventFromDesktop = onEventFromDesktop;

var db = require('./db');
var socketListeners = {};
//example: testmac: [socketobj1, socketobj2],

function socketIOinit(io)
{
  console.log("running on port");
  //angular client connects
  io.on('connection',function(socket){
    console.log("connected", socket);
    // socketListeners
    // call this immediately on loading a PC
    socket.on('registerMacListener',function(macaddr){
      console.log("mac addr: " + macaddr);
      console.log("received mac request");
      if (!socketListeners[macaddr]) {
        socketListeners[macaddr] = [];
      }
      socketListeners[macaddr].push(socket);
    });
  });
}

function onEventFromDesktop(type, data, mac) {
  if (socketListeners[mac]) {
    socketListeners[mac].forEach(function(socket) {
      socket.emit(type, data);
    });
  }
}

function listenForMac(io,mac)
{
  db.selectAll("computers",function(results) {
    results.forEach(function(result) {
      console.log(result);
      listenForMac(io,result.mac);
    });
  });
  console.log(mac + '-status');

    io.on(mac + '-tasks',function(data){

    });
}
