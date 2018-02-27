#!/usr/bin/env bash

docker-compose down
docker rmi -f jupytepide-hub
docker rmi -f jupytepide-hub-user

make build
# make notebook_image
make jupytep_user_notebook

docker-compose up -d
docker ps -a