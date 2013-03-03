#!/bin/sh


read -p "Please enter a commit message: " message

if [ -n "$message" ]
then
	grunt -m="$message"
fi