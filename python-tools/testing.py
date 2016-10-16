import pygame.camera
import pygame.image
import sys

pygame.camera.init()

cameras = pygame.camera.list_cameras()

print "Using camera %s ..." % cameras[0]

webcam = pygame.camera.Camera(cameras[0])

webcam.start()

# grab first frame
img = webcam.get_image()

WIDTH = img.get_width()
HEIGHT = img.get_height()

screen = pygame.display.set_mode( ( WIDTH, HEIGHT ) )
pygame.display.set_caption("pyGame Camera View")

while True :
 for e in pygame.event.get() :
     if e.type == pygame.QUIT :
         sys.exit()

 # draw frame
 screen.blit(img, (0,0))
 pygame.display.flip()
 # grab next frame    
 img = webcam.get_image()