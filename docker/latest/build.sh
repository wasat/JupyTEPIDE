#!/bin/bash

cd 1_scipy-ext-notebook /
sudo docker build -t jupytepide/scipy-ext-notebook:dev . 2>&1 | tee scipy-ext-notebook_dev.log

cd ../2_geo-notebook/
sudo docker build -t jupytepide/geospatial-notebook:dev . 2>&1 | tee geospatial-notebook_dev.log

cd ../3_eo-notebook/
sudo docker build -t jupytepide/eodata-notebook:dev . 2>&1 | tee eodata-notebook_dev.log
