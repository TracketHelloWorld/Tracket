module.exports.decodeBase64 = decodeBase64;
module.exports.writeDataToUserClientFile = writeDataToUserClientFile;

var fsPath = require('fs-path');

var path = require('path').dirname(require.main.filename);

function decodeBase64(base64data) {
  base64data = base64data.replace(/(\r\n|\n|\r)/gm,"");
  var b = new Buffer(base64data, 'base64')
  return b;
}

function writeDataToUserClientFile(uid, filename, content) {
  fsPath.writeFile(path + "/userfiles/" + uid + "/" + filename, content, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("should be successful unless an error is above.");
  });
}
