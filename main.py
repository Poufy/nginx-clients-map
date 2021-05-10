#!/usr/bin/python3
import sys
import re
import os
import json
import ast
import requests

def main():
    try:
        ips_file_name = "ips.txt"
        filename = sys.argv[1]
        # Extract ips and time stamps
        if(len(sys.argv) == 3): 
            ips_timestamps_dict = extract_ips_timestaps(sys.argv[1], sys.argv[2])
        else:
            ips_timestamps_dict = extract_ips_timestaps(sys.argv[1])
        # Merge and write ips to file
        write_ips_file(ips_timestamps_dict, ips_file_name)
        # Iterate over dictionary file and make get requests
        retrieve_locations(ips_file_name)
    except IndexError:
        print ("You did not specify a file")
        sys.exit(1)

# Returns a dictionary containing ips and the latest timestamps
def extract_ips_timestaps(filename, filter=""):
    logsFile = open(filename, 'r')
    lines = logsFile.readlines()

    # Regular expressions
    ip_regex = "\"([0-9.])+\"$" #\[.+\]
    timestamp_regex = "\[.+?\]"

    ip_time_dict = {}

    # Strips the newline character
    for line in lines:
        if(filter in line and re.search(ip_regex, line.strip()) != None):
            ip = re.search(ip_regex, line.strip()).group(0) # Get the matched text
            timestamp = re.search(timestamp_regex, line.strip()).group(0)
            ip_time_dict[ip.strip("\"")] = timestamp 

    return ip_time_dict

def write_ips_file(ips_timestamps_dict, ips_file_name):
    if os.path.exists(ips_file_name): # We already have previous ids, we need to append the existing ones.
        # Read existing ips into dictionary
        ipsFile = open(ips_file_name, 'r');
        contents = ipsFile.read()
        existing_dictionary = ast.literal_eval(contents)

        # Iterate over the new dictionary and append to the existing one
        for key, value in ips_timestamps_dict.items():
            existing_dictionary[key] = value

        # Dump the new dictionary to ips.txt
        ipsFile = open(ips_file_name, 'w')
        json.dump(existing_dictionary, ipsFile)
        ipsFile.close()

    else:
        ipsFile = open(ips_file_name, 'w')
        json.dump(ips_timestamps_dict, ipsFile)
        ipsFile.close() 


def retrieve_locations(filename):
    ipsFile = open(filename, 'r');
    contents = ipsFile.read()
    dictionary = ast.literal_eval(contents)
    
    locationsFile = open("clients.json", 'w')
    locationsFile.write("[")

    dict_len = len(dictionary)
    counter = 0
    for key, value in dictionary.items():
        counter = counter + 1
        URL = "https://get.geojs.io/v1/ip/geo/{}.json".format(key)
        # sending get request and saving the response as response object
        r = requests.get(url = URL)

        # extracting data in json format
        data = r.json()
        data["timestamp"] = value
        datastr = json.dumps(data)
        locationsFile.write(datastr)
        if(counter != dict_len):
            locationsFile.write(",")

    locationsFile.write("]")
    locationsFile.close()

        
main()