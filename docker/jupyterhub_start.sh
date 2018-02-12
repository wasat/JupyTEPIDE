#!/bin/bash
docker stop jupytepide

docker run -it --rm --name "jupytepide" -p 8888:8888 jupytepide/eodata-notebook:ver_1.0.4 start-singleuser.sh