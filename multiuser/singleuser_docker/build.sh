#!/usr/bin/env bash

docker build -t jupytepide-hub-user --build-arg DOCKER_NOTEBOOK_IMAGE=jupytepide/eodata-notebook:ver_1.0.5 .