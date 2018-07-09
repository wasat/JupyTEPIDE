#!/bin/bash
sudo docker build -f Dockerfile.jupyterhub -t jupytepide/hub-base:dev . 2>&1 | tee jupytepide-hub-base.log