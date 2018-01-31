import os
import sys

sys.path.append("/opt/OTB-6.4.0-Linux64/lib/python")
try:
    user_paths = os.environ['PYTHONPATH'].split(os.pathsep)
except KeyError:
    user_paths = []
os.environ['OTB_APPLICATION_PATH'] = "/opt/OTB-6.4.0-Linux64/lib/otb/applications"
