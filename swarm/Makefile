# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

include .env

.DEFAULT_GOAL=build

network:
	@docker network create --driver overlay --attachable jupytepide-swarm-net
#	\ --gateway 172.18.0.1 --subnet 172.18.0.0/24

volumes:
	@docker volume inspect $(DB_VOLUME_DATA) >/dev/null 2>&1 || docker volume create --name $(DB_VOLUME_DATA)
	@docker volume inspect $(POSTGIS_VOLUME_DATA) >/dev/null 2>&1 || docker volume create --name $(POSTGIS_VOLUME_DATA)
	@docker volume inspect $(GEOSERVER_VOLUME_DATA) >/dev/null 2>&1 || docker volume create --name $(GEOSERVER_VOLUME_DATA)
	@docker volume inspect $(NGINX_VOLUME_DATA) >/dev/null 2>&1 || docker volume create --name $(NGINX_VOLUME_DATA)
	@docker volume inspect $(PORTAINER_VOLUME_DATA) >/dev/null 2>&1 || docker volume create --name $(PORTAINER_VOLUME_DATA)

jupytep_user_spawn_image:
	docker build -t $(DOCKER_SPAWN_NOTEBOOK_IMAGE) \
		-f ../spawn/dockerfile \
		--build-arg DOCKER_NOTEBOOK_IMAGE=$(DOCKER_NOTEBOOK_IMAGE) .