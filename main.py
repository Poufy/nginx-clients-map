#!/usr/bin/python3
import sys
import re
import os
import json

def main():
    try:
        ips_file_name = "ips.txt"
        unique_ips_file_name = "unique_ips.txt"
        filename = sys.argv[1]
        ips_timestamps_dict = extract_ips_timestaps(sys.argv[1])
        write_ips_file(ips_timestamps_dict, ips_file_name)
        #write_unique_ips_file(ips_file_name, unique_ips_file_name)
    except IndexError:
        print ("You did not specify a file")
        sys.exit(1)

# Returns a dictionary containing ips and the latest timestamps
def extract_ips_timestaps(filename):
    logsFile = open(filename, 'r')
    lines = logsFile.readlines()

    # Regular expressions
    ip_regex = "^([0-9.])+" #\[.+\]
    timestamp_regex = "\[.+\]"

    ip_time_dict = {}

    # Strips the newline character
    for line in lines:
        ip = re.search(ip_regex, line.strip()).group(0) # Get the matched text
        timestamp = re.search(timestamp_regex, line.strip()).group(0)
        ip_time_dict[ip] = timestamp 

    return ip_time_dict

def write_ips_file(ips_timestamps_dict, ips_file_name):
    # if os.path.exists(ips_file_name):
    #     append_write = 'a' # append if already exists
    # else:
    #     append_write = 'w' # make a new file if not

    ipsFile = open(ips_file_name, 'w')

    json.dump(ips_timestamps_dict, ipsFile)

    # for key, value in ips_timestamps_dict.items() :
    #    ipsFile.write("{} {}\n".format(key, value))
    
    ipsFile.close()

def write_unique_ips_file(ips_file_name, unique_ips_file_name):
    os.system("tac ips.txt | sort -u -t " " -k1,1 > unique_ips.txt")


main()