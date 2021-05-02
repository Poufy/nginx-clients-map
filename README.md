# nginx-clients-map
Map the access logs of an nginx http server to a map of the clients using Google Maps JS API

## Extracting locations without time-stamps

```bash
cut -f1 -d ' ' access.log.1 | sort | uniq >> ips.txt | cat ips.txt | uniq > ips.txt
cat ips.txt | while read ip; do curl https://get.geojs.io/v1/ip/geo/"$ip$.json >> users_locations.txt; done
cat users_locations.txt | jq | echo > json_clients_location.json
```

## Extracting locations with time-stamps

For this task we need to use Python since the queries are slightly more complex and the Bash commands could get lengthy.

* Parse the access log file and take out all the unique IP's alongside the latest time they made a request. File should have lines in this format:
    
    ```x.x.x.x <time>```

* We then iterate over the file line by line and create a get request to the 3rd party API "https://get.geojs.io/v1/ip/geo/yourip.json"

* The API returns a string containing all information like Country, City, Longitude, Latitude. We store all these items in an JSON array alongside the timestamps that we saved.

* We simply use the JSON array with the Google Maps API by supplying the longitude and latitude to display markers on the map. 

* Notes: 
    - We will not overwrite the ips and timestamps file we will only add to it the new entries and new timestamps. We need to maintain this file to map the clients over-time.

## Pipeline

1- Extract ip and timestamps and output them to ips.txt file as a dictionary, therefore we will not have any duplicate IP addresses and we will have the latest timestamps because the lines were added in chronological order. 

2- In subsequent calls (all calls) we will load the dictionary from ips.txt and add the new values to the dictionary and output that to the ips.txt file. This way we only need to maintain one file which is the ips.txt.

3- Iterate over the newly modified file (ips.txt) to create the GET requests to the API.

4- output the responses alongside the timestamps to a json array format.