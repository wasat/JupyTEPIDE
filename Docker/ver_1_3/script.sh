#!/bin/sh

cd 1_addons/
sudo docker build -t jupytepide/scipy-addons-notebook .

cd ../2_geo-notebook/
sudo docker build -t jupytepide/geospatial-notebook  .

cd ../3_eo-notebook/
sudo docker build -t jupytepide/eodata-notebook .

