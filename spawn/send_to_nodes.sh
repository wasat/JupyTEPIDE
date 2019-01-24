#!/usr/bin/env bash

# IMAGE="alpine:latest"
# IMAGE="jupytepide/jupyterhub:0.9.2-1.3"
IMAGE=jupytepide/user-spawn-notebook:dev
TAR_FILE="/tmp/jupytepide_tmp.tar.gz"

TIMEFORMAT='It takes %R seconds to complete this task...'
time {
    docker save ${IMAGE} | gzip --fast > ${TAR_FILE}
 }

scp -i ~/.ssh/jupytep-swarm.key ${TAR_FILE} eouser@192.168.0.10:${TAR_FILE} | pv
ssh -i ~/.ssh/jupytep-swarm.key eouser@192.168.0.10 'docker rmi -f '${IMAGE}'; docker load < '${TAR_FILE}'; rm '${TAR_FILE}

scp -i ~/.ssh/jupytep-swarm.key ${TAR_FILE} eouser@192.168.0.11:${TAR_FILE} | pv
ssh -i ~/.ssh/jupytep-swarm.key eouser@192.168.0.11 'docker rmi -f '${IMAGE}'; docker load < '${TAR_FILE}'; rm '${TAR_FILE}

rm ${TAR_FILE}