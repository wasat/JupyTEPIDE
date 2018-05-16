import mapnik


class Mapnik:

    @staticmethod
    def generate_thumb(infile, resolution, outfile="mapnik_tmp.png"):
        symb = mapnik.RasterSymbolizer()
        rule = mapnik.Rule()
        rule.symbols.append(symb)
        style = mapnik.Style()
        style.rules.append(rule)
        layer = mapnik.Layer("mapLayer")
        layer.datasource = mapnik.Gdal(file=infile)
        layer.styles.append("mapStyle")
        width, height = resolution
        mapnikmap = mapnik.Map(width, height)
        mapnikmap.append_style("mapStyle", style)
        mapnikmap.layers.append(layer)
        mapnikmap.zoom_all()
        mapnik.render_to_file(mapnikmap, outfile)
