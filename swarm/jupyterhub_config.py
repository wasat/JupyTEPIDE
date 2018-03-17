import os

c = get_config()

# c.JupyterHub.authenticator_class = GoogleOAuthenticator
# c.GoogleOAuthenticator.oauth_callback_url = 'http://jupytepide-swarm.wasat.pl/hub/oauth_callback'
# c.GoogleOAuthenticator.client_id = '484740039031-okb9brgs9b8saj00u6asltastmbd4ko1.apps.googleusercontent.com'
# c.GoogleOAuthenticator.client_secret = 'wfFbhwoDlMfcgeVcENcH-SaT'

c.JupyterHub.authenticator_class = 'oauthenticator.GitHubOAuthenticator'
c.GitHubOAuthenticator.oauth_callback_url = 'http://89.250.194.14:9080/hub/oauth_callback'
c.GitHubOAuthenticator.client_id = '962df502db63ad095128'
c.GitHubOAuthenticator.client_secret = '383c8257f1143bce4aa8c87c682129f56a7cb12d'

## The public facing port of the proxy
c.JupyterHub.port = 8000
## The public facing ip of the whole application (the proxy)
c.JupyterHub.ip = '0.0.0.0'
## The ip for this process
c.JupyterHub.hub_ip = '0.0.0.0'
#  Defaults to an empty set, in which case no user has admin access.
c.GoogleOAuthenticator.admin_users = {"zinkiewicz.daniel@gmail.com"}

c.JupyterHub.spawner_class = 'cassinyspawner.SwarmSpawner'
c.SwarmSpawner.jupyterhub_service_name = "jupyterhubserver"

c.SwarmSpawner.networks = ["jupyterhub"]

notebook_dir = os.environ.get('NOTEBOOK_DIR') or '/home/jovyan/work'
c.SwarmSpawner.notebook_dir = notebook_dir

mounts = [{'type': 'volume',
           'source': 'jupyterhub-user-{username}',
           'target': notebook_dir,
           'no_copy': True,
           'driver_config': {
               'name': 'local',
               'options': {
                   'type': 'nfs4',
                   'o': 'addr=89.250.194.14,rw',
                   'device': ':/var/nfs/{username}/'
               }
           },
           }]

c.SwarmSpawner.container_spec = {
    # The command to run inside the service
    'args': ['/usr/local/bin/start-singleuser.sh'],  # (string or list)
    'Image': 'jupyter/datascience-notebook:latest',
    # Replace mounts with [] to disable permanent storage
    'mounts': mounts
}

c.SwarmSpawner.resource_spec = {
    # (int)  CPU limit in units of 10^9 CPU shares.
    'cpu_limit': int(1 * 1e9),
    # (int)  Memory limit in Bytes.
    'mem_limit': int(512 * 1e6),
    # (int)  CPU reservation in units of 10^9 CPU shares.
    'cpu_reservation': int(1 * 1e9),
    # (int)  Memory reservation in bytes
    'mem_reservation': int(512 * 1e6),
}
