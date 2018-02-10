#!/usr/bin/env bash

docker-compose down
docker rmi -f jupytepide-hub jupytepide-hub-user

make build
make notebook_image

docker-compose up -d
docker ps -a