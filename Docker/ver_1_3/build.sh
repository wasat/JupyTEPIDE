#!/bin/bash

cd 1_scipy-ext-notebook /
sudo docker build -t jupytepide/scipy-ext-notebook:ver_1.0.1 .

cd ../2_geo-notebook/
sudo docker build -t jupytepide/geospatial-notebook:ver_1.0.1 .

cd ../3_eo-notebook/
sudo docker build -t jupytepide/eodata-notebook:ver_1.0.1 .
