#!/usr/bin/env bash

docker volume create --driver local nginx_volume

docker run \
  --cap-add=NET_ADMIN \
  --name nginx \
  -p 443:443 \
  -p 80:80 \
  -e EMAIL=jupytep@wasat.pl \
  -e URL=jupyteo.com \
#  -e URL=jupytepide.ga \
  -e SUBDOMAINS=www \
  -v nginx_volume:/config \
  linuxserver/letsencrypt