import os
import sys
import shutil

homedir = os.environ['HOME']

if not os.path.exists(os.path.join(homedir,'grassdata','location','PERMANENT')):
    try:
        shutil.rmtree(os.path.join(homedir,'grassdata'))
    except:
		pass
    os.mkdir(os.path.join(homedir,'grassdata'))
    os.mkdir(os.path.join(homedir,'grassdata','location'))
    os.mkdir(os.path.join(homedir,'grassdata','location','PERMANENT'))
    os.mkdir(os.path.join(homedir,'grassdata','location','PERMANENT','sqlite'))
    os.chdir(os.path.join(homedir,'grassdata','location','PERMANENT'))
    with open('WIND','w') as f:
        f.writelines("proj:       3\n")
        f.writelines("zone:       0\n")
        f.writelines("north:      1N\n")
        f.writelines("south:      0\n")
        f.writelines("east:       1E\n")
        f.writelines("west:       0\n")
        f.writelines("cols:       1\n")
        f.writelines("rows:       1\n")
        f.writelines("e-w resol:  1\n")
        f.writelines("n-s resol:  1\n")
        f.writelines("top:        1.000000000000000\n")
        f.writelines("bottom:     0.000000000000000\n")
        f.writelines("cols3:      1\n")
        f.writelines("rows3:      1\n")
        f.writelines("depths:     1\n")
        f.writelines("e-w resol3: 1\n")
        f.writelines("n-s resol3: 1\n")
        f.writelines("t-b resol:  1\n")
    with open('VAR','w') as f:
        f.writelines(["DB_DRIVER: sqlite\n","DB_DATABASE: $GISDBASE/$LOCATION_NAME/$MAPSET/sqlite/sqlite.db"])
    with open('PROJ_UNITS','w') as f:
        f.writelines("\n".join(["unit: degree","units: degrees","meters: 1.0"]))
    with open('PROJ_INFO','w') as f:
        f.writelines("\n".join(["name: WGS 84","datum: wgs84","ellps: wgs84",
                                "proj: ll","no_defs: defined","towgs84: 0.000,0.000,0.000"]))
    with open('PROJ_EPSG','w') as f:
        f.writelines("epsg: 4326")
    with open('MYNAME','w') as f:
        f.writelines("default")
    with open('DEFAULT_WIND','w') as f:
        f.writelines("proj:       3\n")
        f.writelines("zone:       0\n")
        f.writelines("north:      1N\n")
        f.writelines("south:      0\n")
        f.writelines("east:       1E\n")
        f.writelines("west:       0\n")
        f.writelines("cols:       1\n")
        f.writelines("rows:       1\n")
        f.writelines("e-w resol:  1\n")
        f.writelines("n-s resol:  1\n")
        f.writelines("top:        1.000000000000000\n")
        f.writelines("bottom:     0.000000000000000\n")
        f.writelines("cols3:      1\n")
        f.writelines("rows3:      1\n")
        f.writelines("depths:     1\n")
        f.writelines("e-w resol3: 1\n")
        f.writelines("n-s resol3: 1\n")
        f.writelines("t-b resol:  1\n")
