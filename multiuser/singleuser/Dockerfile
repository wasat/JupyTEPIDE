ARG DOCKER_NOTEBOOK_IMAGE
FROM $DOCKER_NOTEBOOK_IMAGE

#RUN jupyter nbextension install https://github.com/kenkoooo/jupyter-autopep8/archive/master.zip --user && \
#    jupyter nbextension enable jupyter-autopep8-master/jupyter-autopep8 --sys-prefix

USER root
RUN chmod -R 755 /home/jovyan/.local/share/jupyter/nbextensions/source_UI

# Install JupyTEP IDE UI layout and enable it
RUN rm -r /tmp/*  && \
    cd /tmp && \
    git clone https://github.com/wasat/JupyTEPIDE.git && \
    cd JupyTEPIDE && \
    cp -R notebooks /home/jovyan/ && \
    cd GUI && \
    jupyter nbextension install source_UI --user && \
    jupyter nbextension enable source_UI/main --sys-prefix && \
    mkdir -p /home/jovyan/.ipython/profile_default/startup && \
    cp /tmp/JupyTEPIDE/scripts/startup/01-otb-paths.py /home/jovyan/.ipython/profile_default/startup/01-otb-paths.py && \
    cp /tmp/JupyTEPIDE/scripts/Leaflet/__init__.py /home/jovyan/.ipython/profile_default/startup/02-init-leaflet.py && \
    rm -rf JupyTEPIDE

RUN rm -r /tmp/*  && \
    fix-permissions $CONDA_DIR && \
    fix-permissions /home/$NB_USER

WORKDIR /home/$NB_USER
USER $NB_USER