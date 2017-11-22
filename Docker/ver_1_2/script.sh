#!/bin/sh

cd clean-gui-notebook
sudo docker build -t jupytepide/scipy-clean-gui .

cd ./addons-notebook/
sudo docker build -t jupytepide/pyaddons-notebook .

cd ./geo-notebook/
sudo docker build -t jupytepide/geospatial-notebook  .

cd ./eo-notebook/
sudo docker build -t jupytepide/eo-notebook .

