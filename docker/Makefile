# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

include docker.env

.DEFAULT_GOAL=build

pull:
	docker pull $(DOCKER_REG)/$(DOCKER_NOTEBOOK_IMAGE)

notebook_image: pull singleuser/Dockerfile
	docker build -t $(LOCAL_NOTEBOOK_IMAGE) \
		--build-arg JUPYTERHUB_VERSION=$(JUPYTERHUB_VERSION) \
		--build-arg DOCKER_NOTEBOOK_IMAGE=$(DOCKER_NOTEBOOK_IMAGE) \
		singleuser

jupytep_user_notebook: pull singleuser/Dockerfile
	docker build -t $(LOCAL_NOTEBOOK_IMAGE) \
		--build-arg DOCKER_NOTEBOOK_IMAGE=$(DOCKER_NOTEBOOK_IMAGE) \
		--build-arg DOCKER_REG=$(DOCKER_REG) \
		singleuser

#docker pull $(DOCKER_REG)$(DOCKER_SCIPY_IMAGE):$(DOCKER_STACK_VER) latest/1_scipy-ext-notebook/dockerfile
scipy_notebook_build:
	docker build -t $(DOCKER_SCIPY_IMAGE):$(DOCKER_VER) \
	    --file latest/1_$(DOCKER_SCIPY_NAME)/dockerfile \
		--build-arg DOCKER_STACK_VER=$(DOCKER_STACK_VER) \
		. 2>&1 | tee logs/$(DOCKER_SCIPY_NAME)_$(DOCKER_VER).log

geo_notebook_build:
	docker build -t $(DOCKER_GEO_IMAGE):$(DOCKER_VER) \
	    --file latest/2_$(DOCKER_GEO_NAME)/dockerfile \
		--build-arg DOCKER_VER=$(DOCKER_VER) \
		. 2>&1 | tee logs/$(DOCKER_GEO_NAME)_$(DOCKER_VER).log

eodata_notebook_build:
	docker build -t $(DOCKER_EO_IMAGE):$(DOCKER_VER) \
	    --file latest/3_$(DOCKER_EO_NAME)/dockerfile \
		--build-arg DOCKER_VER=$(DOCKER_VER) \
		. 2>&1 | tee logs/$(DOCKER_EO_NAME)_$(DOCKER_VER).log

build_all: scipy_notebook_build geo_notebook_build eodata_notebook_build

scipy_notebook_push: docker push $(DOCKER_SCIPY_IMAGE)

geo_notebook_push:
    docker push $(DOCKER_REG)$(DOCKER_GEO_IMAGE):$(DOCKER_VER)

eo_notebook_push:
    docker push $(DOCKER_REG)$(DOCKER_EO_IMAGE):$(DOCKER_VER)

push_all: scipy_notebook_push geo_notebook_push eo_notebook_push

all: build_all push_all

.PHONY: pull notebook_image
