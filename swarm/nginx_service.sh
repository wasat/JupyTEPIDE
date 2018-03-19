#!/usr/bin/env bash
docker service create \
  --name nginx \
  --publish 80:80 \
  --detach=true \
  --network jupyterhub \
  --mount type=bind,src=/etc/jupyterhub/nginx.conf,dst=/etc/nginx/conf.d/default.conf \
  nginx
