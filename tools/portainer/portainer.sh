#!/usr/bin/env bash

docker container run -d -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock --name jupytepide-portainer portainer/portainer