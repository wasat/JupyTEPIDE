#!/usr/bin/env bash
docker service create \
  --mount type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock \
  --mount type=bind,src=/etc/jupyterhub,dst=/srv/jupyterhub \
  --name jupyterhubserver \
  --network jupyterhub \
  --constraint 'node.role == manager' \
  --detach=true \
  jupytepide/jupyterhub-docker:latest
