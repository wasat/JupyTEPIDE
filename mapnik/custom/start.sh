#!/bin/bash

# Start supervisord
/etc/init.d/supervisord start
# Start nginx
service nginx start

# Start sshd service
/usr/sbin/sshd -D

# create the notebook directory
NBDIR=/etc/tilestache
# make it owned by the GID of the notebook containers.
# This is 100 in the jupyter docker-stacks,
# but should be whatever GID your containers run as
chown 1000:100 "$NBDIR"
# make it group-setgid-writable
chmod g+rws "$NBDIR"
# set the default permissions for new files to group-writable
setfacl -d -m g::rwx "$NBDIR"