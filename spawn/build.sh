#!/usr/bin/env bash

docker build \
    -t jupytepide/user-spawn-notebook:dev \
    --build-arg DOCKER_NOTEBOOK_IMAGE=jupytepide/eodata-notebook:1.3.5 \
    -f Dockerfile .