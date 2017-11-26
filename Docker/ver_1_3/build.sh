#!/bin/sh

cd 1_scipy-ext-notebook /
sudo docker build -t jupytepide/scipy-ext-notebook:latest .

cd ../2_geo-notebook/
sudo docker build -t jupytepide/geospatial-notebook:latest .

cd ../3_eo-notebook/
sudo docker build -t jupytepide/eodata-notebook:latest .