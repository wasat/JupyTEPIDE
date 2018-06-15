FROM jupytepide/tilestache-mapnik:latest

LABEL maintainer="JupyTEP IDE Project <jupytep@wasat.pl>"

RUN apt-get update -qq && \
    apt-get install -qqy acl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN chown 1000:100 /etc/tilestache && \
    chown -R 1000:100 /etc/tilestache/* && \
    chmod -R g+rws /etc/tilestache/* && \
    setfacl -d -m g::rwx /etc/tilestache