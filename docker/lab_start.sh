#!/bin/bash
docker stop geoserver9421 postgis9421 jupytepide
docker rm geoserver9421 postgis9421 jupytepide

docker run --name "postgis9421" -d -t kartoza/postgis:9.4-2.1
docker run --name "geoserver9421"  --link postgis9421:postgis -p 8080:8080 -d -t kartoza/geoserver
docker run -v /eodata:/eodata -it --rm --name "jupytepide" --link geoserver9421:geoserver -p 8888:8888 jupytepide/eodata-notebook:latest start.sh jupyter lab 
