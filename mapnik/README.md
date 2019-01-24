This repo contains map service witch allows to publish geotiff images via https.
Javascript frameworks like openlayers or leaflet, can communicate with this solution to get images which can be presented on the dynamic map. 

The solution used modified WMS protocol(GetMap only). Needed request arguments are:
1. BBOX - should be in the same coordinate system as datasource
2. WIDTH - width in pixels of destination image
3. HEIGHT - height in pixels of destination image
4. PATH - path to tif data source, available for www-data user on docker maschine (it was planed to store ds on external docker volume)

Repo contains also html tester, simple html file which allows to check if service is working. 

This software can have bugs, work unexpected or randomly :)

test url:
https://89.250.194.14:9443/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=RGB&PATH=%2Fopt%2Fmapnik%2Fmapnik-test.tif&CRS=EPSG%3A3857&STYLES=&FORMAT_OPTIONS=dpi%3A113&WIDTH=1076&HEIGHT=929&BBOX=318956.43162838346%2C4239381.03756376%2C2424460.237960534%2C6057237.019053135