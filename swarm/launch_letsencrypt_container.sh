#!/usr/bin/env bash
docker run \
  --cap-add=NET_ADMIN \
  --name nginx \
  -p 443:443 \
  -p 80:80 \
  --detach \
  -e EMAIL=jupytep@wasat.pl \
# -e URL=jupytepide.ga \
  -e URL=jupyteo.com \
  -e SUBDOMAINS=cloud,demo,try,notebooks \
  -v nginx_volume:/config \
  --network jupytepide-swarm-net \
  --mount type=bind,src=/home/eouser/jupytep-dev/swarm/letsencrypt_container_nginx.conf,dst=/config/nginx/site-confs/default \
  linuxserver/letsencrypt
