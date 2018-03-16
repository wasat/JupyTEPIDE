import os

from oauthenticator.google import GoogleOAuthenticator

c = get_config()

c.JupyterHub.authenticator_class = GoogleOAuthenticator
c.GoogleOAuthenticator.oauth_callback_url = 'http://jupytepide-swarm.wasat.pl/hub/oauth_callback'
c.GoogleOAuthenticator.client_id = '484740039031-okb9brgs9b8saj00u6asltastmbd4ko1.apps.googleusercontent.com'
c.GoogleOAuthenticator.client_secret = 'wfFbhwoDlMfcgeVcENcH-SaT'

# c.JupyterHub.authenticator_class = 'oauthenticator.GitHubOAuthenticator'
# c.GitHubOAuthenticator.oauth_callback_url = 'https://185.52.193.12/hub/oauth_callback'
# c.GitHubOAuthenticator.client_id = 'b68114058cb019b0a42e'
# c.GitHubOAuthenticator.client_secret = '770dfe07a7a75fd9d02a27a19f24534610e17cd8'

## The public facing port of the proxy
c.JupyterHub.port = 9080
## The public facing ip of the whole application (the proxy)
c.JupyterHub.ip = '89.250.194.14'
## The ip for this process
c.JupyterHub.hub_ip = '0.0.0.0'
#  Defaults to an empty set, in which case no user has admin access.
c.GoogleOAuthenticator.admin_users = {"youremail@gmail.com"}

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
                   'o': 'addr=192.168.1.200,rw',
                   'device': ':/var/nfs/{username}/'
               }
           },
           }]

c.SwarmSpawner.container_spec = {
    # The command to run inside the service
    'args': ['/usr/local/bin/start-singleuser.sh'],  # (string or list)
    'Image': 'jupytepide/eodata-notebook:latest',
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
