ARG DOCKER_REG
ARG DOCKER_NOTEBOOK_IMAGE
FROM $DOCKER_REG$DOCKER_NOTEBOOK_IMAGE

#RUN jupyter nbextension install https://github.com/kenkoooo/jupyter-autopep8/archive/master.zip --user && \
#    jupyter nbextension enable jupyter-autopep8-master/jupyter-autopep8 --sys-prefix

USER root

# Install JupyTEP IDE UI layout and enable it
RUN mkdir /eodata && \
    cd /opt && \
    rm -rf /opt/JupyTEPIDE && \
    git clone -b dev --single-branch https://github.com/wasat/JupyTEPIDE.git && \
    find /tmp -mindepth 1 -maxdepth 1 -print0 | xargs -0 rm -rf && \
    fix-permissions $CONDA_DIR && \
    fix-permissions /home/$NB_USER

WORKDIR /home/$NB_USER
USER $NB_USER