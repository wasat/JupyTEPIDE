#!/bin/sh

cp /tmp/jupyterhub_config.py /srv/jupyterhub/jupyterhub_config.py

jupyterhub -f /srv/jupyterhub/jupyterhub_config.py