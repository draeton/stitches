#!/bin/sh

if [ -n "$1" ]
then
	grunt pages -m="$1"
else
	echo "Please enter a commit message."
fi