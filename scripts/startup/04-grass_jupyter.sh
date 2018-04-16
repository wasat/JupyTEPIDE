# directory where GRASS GIS lives
export GISBASE=`grass74 --config path`   # or define path to binaries like /usr/local/grass-7.4.svn
echo $GISBASE

# generate GISRC
# Defines the system wide value while in a GRASS session
MYGISDBASE=$HOME/grassdata # Change this path to reflect your own
MYLOC=MyLoc # Change this location name to reflect your own
MYMAPSET=PERMANENT

# Set the global grassrc file to individual file name
MYGISRC="$HOME/.grassrc.$$"

echo "GISDBASE: $MYGISDBASE" > "$MYGISRC"
echo "LOCATION_NAME: $MYLOC" >> "$MYGISRC"
echo "MAPSET: $MYMAPSET" >> "$MYGISRC"
echo "GRASS_GUI: text" >> "$MYGISRC"

# path to GRASS settings file
export GISRC=$MYGISRC

export LD_LIBRARY_PATH=$GISBASE/lib:$LD_LIBRARY_PATH
export PYTHONPATH=$GISBASE/etc/python:$PYTHONPATH
export PATH=$GISBASE/bin:$GISBASE/scripts:$PATH
