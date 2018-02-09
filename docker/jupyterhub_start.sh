#!/bin/bash
docker stop scipy-notebook

docker run -it --rm --name "scipy-notebook" -p 8888:8889 jupyter/scipy-notebook start-singleuser.sh