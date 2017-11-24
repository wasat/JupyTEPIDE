#!/bin/sh

docker pull jupytepide/eodata-notebook
docker run -it --rm -p 8888:8888 jupytepide/eodata-notebook