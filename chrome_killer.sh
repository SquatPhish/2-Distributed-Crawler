#!/bin/bash

#a bash script to kill Chrome every 4 hours
# time to sleep
a=$(( 4*60*60 ))
echo "Time to sleep $a"

while true; do
	pkill -9 chrome
	sleep $a
done

#run as ./timekiller.sh &
