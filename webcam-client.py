from socketIO_client import SocketIO
import cv2, base64

class Webcam(object):
    def __init__(self):
        self.cam = cv2.VideoCapture(0)
    
    def __del__(self):
        self.cam.release()

    def get_feed(self):
        while True:
            success, image = self.cam.read()
            feed = cv2.imencode('.png', image)[1].tostring()
            return base64.b64encode(feed)

    def get_image(self):
        success, image = self.cam.read()
        image = cv2.imencode('.png', image)[1].toString()
        return base64.b64encode(image)
        
      
