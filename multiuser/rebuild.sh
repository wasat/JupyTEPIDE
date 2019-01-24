#!/usr/bin/env bash

docker-compose down
docker rmi -f jupytepide-hub
docker rmi -f jupytepide-hub-user:latest

# make build
make jupytep_user_spawn_image

cd /opt
rm -rf /opt/JupyTEPIDE/
git clone -b dev --single-branch https://github.com/wasat/JupyTEPIDE.git
rm -rf /opt/JupyTEPIDE/sdk/
ln -s ~/jupytep-dev/sdk/ /opt/JupyTEPIDE
ln -s /eodata /eodata-demo
ln -s /opt/eodata /eodata-opt
cd ~/jupytep-dev/multiuser

docker-compose up -d
docker ps -a
