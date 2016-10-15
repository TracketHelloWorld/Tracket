module.exports.command = {
  action: 0,
  cmd: ""
};
module.exports.kill = kill;
module.exports.cmd = cmd;
module.exports.resetCommand = resetCommand;
module.exports.getCommand = getCommand;

var db = require('./db');

function getCommand(mac,res)
{
  db.where("commands","mac",mac,function(results){
    if(results != null)
    {
      module.exports.command.action = results[0].action;
      module.exports.command.cmd = results[0].cmd;
    }
    res.send(JSON.stringify(module.exports.command));
    resetCommand(mac);
  })
}

function kill(pid,mac,res)
{
  module.exports.command.action = 1;
  module.exports.command.cmd = pid;
  var command = module.exports.command;
  command.mac = mac;
  db.insert("commands",command,function(){
    res.send(JSON.stringify({success: true}));
  },function(){})
}

function cmd(command,mac,res)
{
  module.exports.command.action = 2;
  module.exports.command.cmd = command;
  var command = module.exports.command;
  command.mac = mac;
  db.insert("commands",command,function(){
    res.send(JSON.stringify({success: true}));
  },function(){})
}

function resetCommand(mac)
{
  db.deleteRows("commands","mac",mac,function(){});
  module.exports.command = {
    action: 0,
    cmd: ""
  };
}
