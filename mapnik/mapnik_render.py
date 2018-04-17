import mapnik

ndvi_symb = mapnik.RasterSymbolizer()
ndvi_colorizer = mapnik.RasterColorizer(mapnik.COLORIZER_LINEAR, mapnik.Color(0, 0, 0, 255))

ndvi_colorizer.add_stop(-1, mapnik.Color("red"))
ndvi_colorizer.add_stop(0, mapnik.Color("red"))
ndvi_colorizer.add_stop(0.001, mapnik.Color("yellow"))
ndvi_colorizer.add_stop(1, mapnik.Color("darkgreen"))
ndvi_symb.colorizer = ndvi_colorizer

ndvi_rule = mapnik.Rule()
ndvi_rule.symbols.append(ndvi_symb)
ndvi_style = mapnik.Style()
ndvi_style.rules.append(ndvi_rule)

layer = mapnik.Layer("mapLayer")
layer.datasource = mapnik.Gdal(file="/tmp/mapnik/test_ndvi_3857.tif", band=1)
layer.styles.append("mapStyle")  # style can has

width = 800  # width of map in px
height = 600  # height of map in px

map = mapnik.Map(width, height)
im = mapnik.Image(width, height)  # this is not necessary if you want render map to file

map.append_style("mapStyle", ndvi_style)
map.layers.append(layer)

bbox = "2327354.637227047,7034805.461197911,2571953.1277396106,7218560.077195475"  # sample bbox
bbox = (float(i) for i in bbox.split(","))
bbox = mapnik.Box2d(next(bbox), next(bbox), next(bbox), next(bbox))
map.zoom_to_box(bbox)

# map.zoom_all() # zooms to full extent of datasource

mapnik.render(map, im)  # renders output raster to image
print(im.tostring('png'))

mapnik.render_to_file(map, "nowy.png")  # renders map to file
