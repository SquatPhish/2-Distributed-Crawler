#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys


def split_file_into_chunks(filename, num_of_chunks):
    print ("Parse the URL list")

    size = sum(1 for line in open(filename))
    chunk_size = int(size/num_of_chunks)

    if chunk_size <= 0:
        return

    with open(filename, 'r') as f:
        iter, chunk_id = 0, 0
        lines = list()
        for line in f.readlines():
            lines.append(line)
            iter += 1
            if iter == chunk_size:
                print ("Save chunk id {}".format(chunk_id))
                write_list_into_file(lines, "./chunks/" + str(chunk_id) + ".txt")
                chunk_id += 1
                iter = 0
                lines = list()

        if len(lines) > 0:
            print ("Save chunk id {}".format(chunk_id))
            write_list_into_file(lines, "./chunks/" + str(chunk_id) + ".txt")

    print ("Done the parse and split")


def write_list_into_file(thelist, filepath):
    thefile = open(filepath, 'a+')

    for item in thelist:
        thefile.write("%s" % item)

    thefile.flush()
    thefile.close()


def test():
    f = "test/crawl_demo_url_list.txt"
    num_of_chunks = 5
    split_file_into_chunks(f, num_of_chunks)


if __name__ == "__main__":
    filename = sys.argv[1]
    number_of_chunks = int(sys.argv[2])
    split_file_into_chunks(filename, number_of_chunks)
