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

base_notebook_build:
	docker build -t $(DOCKER_BASE_IMAGE):$(DOCKER_VER) \
		--file latest/0_$(DOCKER_BASE_NAME)/dockerfile \
		--build-arg DOCKER_STACK_VER=$(DOCKER_STACK_VER) \
		. 2>&1 | tee logs/$(DOCKER_BASE_NAME)_$(DOCKER_VER).log

sci_notebook_build:
	docker build -t $(DOCKER_SCI_IMAGE):$(DOCKER_VER) \
		--file latest/1_$(DOCKER_SCI_NAME)/dockerfile \
		--build-arg DOCKER_VER=$(DOCKER_VER) \
		. 2>&1 | tee logs/$(DOCKER_SCI_NAME)_$(DOCKER_VER).log

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

build_all: base_notebook_build sci_notebook_build geo_notebook_build eodata_notebook_build

base_notebook_latest:
	docker tag $(DOCKER_BASE_IMAGE):$(DOCKER_VER) $(DOCKER_BASE_IMAGE):latest

sci_notebook_latest:
	docker tag $(DOCKER_SCI_IMAGE):$(DOCKER_VER) $(DOCKER_SCI_IMAGE):latest

geo_notebook_latest:
	docker tag $(DOCKER_GEO_IMAGE):$(DOCKER_VER) $(DOCKER_GEO_IMAGE):latest

eo_notebook_latest:
	docker tag $(DOCKER_EO_IMAGE):$(DOCKER_VER) $(DOCKER_EO_IMAGE):latest

tag_all: base_notebook_latest sci_notebook_latest geo_notebook_latest eo_notebook_latest


base_notebook_push:
	docker push $(DOCKER_BASE_IMAGE)
	docker rmi $(DOCKER_BASE_IMAGE):latest

sci_notebook_push:
	docker push $(DOCKER_SCI_IMAGE)
	docker rmi $(DOCKER_SCI_IMAGE):latest

geo_notebook_push:
	docker push $(DOCKER_GEO_IMAGE)
	docker rmi $(DOCKER_GEO_IMAGE):latest

eo_notebook_push:
	docker push $(DOCKER_EO_IMAGE)
	docker rmi $(DOCKER_EO_IMAGE):latest

push_all: base_notebook_push sci_notebook_push geo_notebook_push eo_notebook_push

all: build_all tag_all push_all

.PHONY: pull notebook_image