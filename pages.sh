#!/bin/sh

if [ -n "$1" ]
then
	rm -rf ../gh-pages/stitches/repo
	grunt pages -m="$1"
else
	echo "Please enter a commit message."
fi