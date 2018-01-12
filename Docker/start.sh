#!/bin/bash
docker stop geoserver-ver_1.0 postgis-ver_1.0 jupytepide
docker rm geoserver-ver_1.0 postgis-ver_1.0 jupytepide


docker run --name "postgis-ver_1.0" -d -t jupytepide/kartoza-postgis:ver_1.0
docker run --name "geoserver-ver_1.0"  --link postgis-ver_1.0:postgis -p 8080:8080 -d -t jupytepide/kartoza-geoserver:ver_1.0

cd ~/JupyTEPIDE
git pull

sudo mount /eodata

docker run -v /eodata:/eodata -v ~/JupyTEPIDE/notebooks:/home/jovyan/notebooks-local -it --rm --name "jupytepide" --link geoserver-ver_1.0:geoserver -p 8888:8888 jupytepide/eodata-notebook:ver_1.0.2 start-notebook.sh --NotebookApp.token=''
