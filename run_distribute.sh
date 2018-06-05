#!/bin/bash

echo "Run the pipeline"

file=$1
num=$2


echo "Clean data in the chunks folder"
rm -rf chunks/*

echo "Split the URL list into chunks"
python3 parse.py $file $num

echo "Make the data folder"
rm -rf data
mkdir data

echo "Compile the task_disptcher"
gcc task_dispatcher.c --std=c99

./a.out 0 $num