module.exports.socketIOinit = socketIOinit;
module.exports.listenForMac = listenForMac;
module.exports.onEventFromDesktop = onEventFromDesktop;

var db = require('./db');
var socketListeners = {};
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
      /*if (!socketListeners[macaddr]) {
        socketListeners[macaddr] = [];
      }
      socketListeners[macaddr].push(socket);*/
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


//junk
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
