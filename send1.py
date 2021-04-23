import socket
import sys
import time
import struct
import pickle

#parameters = [3, 3, 16, 236, 4, 167, 234, 253, 69, 16, 17, 0, 0, 193, 11, 0, 0, 127, 21, 0 , 0]
parameters = [66, 67, 16, 236, 4, 167, 234, 253, 69, 16, 17, 0, 0, 193, 11, 0, 0, 127, 21, 0 , 0]
   
# Create a TCP/IP socket
sock = socket.socket( socket.AF_INET, socket.SOCK_STREAM )

server_address = ( 'localhost', 5000 )
print( 'Connecting to {} port {}'.format( *server_address ) )
sock.connect(server_address)

i = 0

while True:
    time.sleep( 1 )   
    sock.send( bytes(parameters) )
