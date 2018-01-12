#!/bin/bash

cd 1_scipy-ext-notebook /
sudo docker build -t jupytepide/scipy-ext-notebook:ver_1.0.2 . 2>&1 | tee -a scipy-ext-notebook_ver_1_0_2.log


cd ../2_geo-notebook/
sudo docker build -t jupytepide/geospatial-notebook:ver_1.0.2 . 2>&1 | tee -a geospatial-notebook_ver_1_0_2.log


cd ../3_eo-notebook/
sudo docker build -t jupytepide/eodata-notebook:ver_1.0.2 . 2>&1 | tee -a eodata-notebook_ver_1_0_2.log

