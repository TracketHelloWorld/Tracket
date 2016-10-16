#!/usr/bin/python

import os, sys
from sys import argv
from os import listdir, sep
from os.path import abspath, basename, isdir
from sys import argv

# Open a file
def lists(path):
	dirs = os.listdir( path )
	return dirs
	# This would print all the files and directories
	