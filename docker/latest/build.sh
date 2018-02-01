#!/bin/bash

cd 1_scipy-ext-notebook /
sudo docker build -t jupytepide/scipy-ext-notebook:ver_1.0.5 . 2>&1 | tee scipy-ext-notebook_ver_1_0_5.log


cd ../2_geo-notebook/
sudo docker build -t jupytepide/geospatial-notebook:ver_1.0.5 . 2>&1 | tee geospatial-notebook_ver_1_0_5.log


cd ../3_eo-notebook/
sudo docker build -t jupytepide/eodata-notebook:ver_1.0.5 . 2>&1 | tee eodata-notebook_ver_1_0_5.log

