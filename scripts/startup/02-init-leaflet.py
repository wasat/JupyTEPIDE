import json
from IPython.display import HTML, display
from shutil import copyfile
import os
import re

class Leaflet():
    wmsAttribs = {
        'layers': '',
        'styles': '',
        'format': 'image/png',
        'transparent': True,
        'version': '1.1.1',
        'crs': 'null',
        'uppercase': False
    }

    params = {
        'color': 'red',
        'fillColor': '#f03',
        'fillOpacity': 0.5
    }

    def _attrib2string(self):
        ls = []
        for k, v in self.wmsAttribs.items():
            s = ''
            if type(v) == bool:
                val = str(v).lower()
            else:
                val = '\'' + v + '\''
            s += k + ':' + val
            ls.append(s)
        s = ','.join(ls)
        return s

    def _dict2string(self, d):
        ls = []
        for k, v in d:
            s = ''
            if type(v) == bool:
                val = str(v).lower()
            elif isinstance(v, str):
                val = '\'' + v + '\''
            else:
                val = str(v)
            s += k + ':' + val
            ls.append(s)
        s = ','.join(ls)
        return s

    def setView(self, B, L, zoom):
        htm = '''<script type="text/javascript">Jupytepide.map_setView([%f,%f],%f);</script>''' % (B, L, zoom)
        display(HTML(htm))

    def addRasterLayer(self):  # TODO: dorobic rastra
        pass

    def addJsonLayer(self, geojson, name):

        if isinstance(geojson, dict):
            j = json.dumps(geojson)
        else:
            j = geojson

        htm = '''<script type="text/javascript">Jupytepide.map_addGeoJsonLayer(%s,"%s");</script>''' % (j, name)
        display(HTML(htm))

    def addCircle(self, x, y, r, popup='', params=-1):
        if params == -1:
            params = self.params
        htm = '''<script type="text/javascript">Jupytepide.map_addCircle([%f,%f],%f,%s,{%s});</script>''' % (
            x, y, r, popup, params)
        display(HTML(htm))

    def addMarker(self, x, y, popup='{title:\'Marker\', text:\'Marker\'}'):
        htm = '''<script type="text/javascript">Jupytepide.map_addMarker([%f,%f],%s);</script>''' % (x, y, popup)
        display(HTML(htm))

    def addPolygon(self, x, y, popup=''):
        """
        :param x: list of x
        :param y: list of y
        :param popup: popup message
        :return:
        """
        s = '['
        lista = []
        lx = zip(x, y)
        for i in lx:
            lista.append('[%f,%f]' % (i[0], i[1]))
        s += ",".join(lista)
        s += ']'
        htm = '''<script type="text/javascript">Jupytepide.map_polygon(%s,%s);</script>''' % (s, popup)
        display(HTML(htm))

    def addPolygon(self, tupleXY, popup):
        """
        :param tupleXY: list of tuples (x,y)
        :param popup: popup message
        :return:
        """
        s = '['
        lista = []
        for i in tupleXY:
            lista.append('[%f,%f]' % (i[0], i[1]))
        s += ",".join(lista)
        s += ']'
        htm = '''<script type="text/javascript">Jupytepide.map_polygon(%s,%s);</script>''' % (s, popup)
        display(HTML(htm))

    def addWmsLayer(self, url, name, attrib=-1):
        if attrib == -1:
            attrib = self._attrib2string()
        elif isinstance(attrib, str):
            pass
        else:
            attrib = self._dict2string(attrib)

        htm = '''<script type="text/javascript">Jupytepide.map_addWmsLayer(%s,{%s},"%s");</script>''' % (
            url, attrib, name)
        display(HTML(htm))

    def addTileLayer(self, url, name, attrib=-1):
        if attrib == -1:
            attrib = self._attrib2string()
        elif isinstance(attrib, str):
            pass
        else:
            attrib = self._dict2string(attrib)
        htm = '''<script type="text/javascript">Jupytepide.map_addTileLayer('%s',{%s},"%s");</script>''' % (
            url, attrib, name)
        display(HTML(htm))



class WMSLayer():
    htm = ''
    wmsAttribs = {
        'layers': '',
        'styles': '',
        'format': 'image/png',
        'transparent': True,
        'version': '1.1.1',
        'crs': 'null',
        'uppercase': False
    }
    name = ''
    url = ''
    requestParameters = ''

    def attributesTostring(self):
        wynik = ''
        for k, v in self.wmsAttribs.items():
            wynik += k + ":'" + v + "',"
        return (wynik[:-1])

    def addWmsLayer(self, url, name, attrib=-1):
        if (attrib != -1):
            self.wmsAttribs = attrib
        self.name = name
        self.url = url

    def showLayer(self):
        self.htm = '''<script type="text/javascript">Jupytepide.map_addWmsLayer("%s",{%s},"%s");</script>''' % (
            self.url, self.attributesTostring(), self.name)
        display(HTML(self.htm))

    def removeLayer(self):
        htm = '''<script type = "text/javascript"> Jupytepide.map_removeLayer("%s"); < / script > ''' % self.name
        display(HTML(htm))

    def changeAttributes(self, name, value):
        self.wmsAttribs[name] = value


class ImageLayer():
    htm = ''
    attribs = {'opacity': '0.3'}
    name = ''
    url = ''
    bounds = ''

    def __init__(self):
        if not os.path.exists("thumbnailtmp"):
            os.makedirs("thumbnailtmp")

    def thumbnail(self,product):
        #TODO: add support for other missions and products
        if os.path.isfile(product):
            product=os.path.dirname(product)
        files = [f for f in os.listdir(product) if os.path.isfile(os.path.join(product, f))]
        bbox=None
        if 'Envisat' in product:
            return -1
        elif 'Landsat-5' in product:
            for f in files:
                if f.lower().endswith('jpg'):
                    thumbnail=f
                if f.lower().endswith('bp.xml'):
                    with open(os.path.join(product,f),'r') as xml:
                        g=xml.readlines()
                        for i in g:
                            if 'rep:coordList' in i:
                                m=re.findall(r'(?<=<rep:coordList>).*?(?=</rep:coordList>)',i,re.I)
                                if not m:
                                    return -1
                                else:
                                    bbox=[float(xx) for xx in m[0].split()]
        thumbnail=os.path.join(product,thumbnail)
        copyfile(thumbnail, "thumbnailtmp/thumb.jpg")        
        bbox='''[[%f,%f],[%f,%f]]'''%(bbox[0],bbox[3],bbox[2],bbox[1])
        print (bbox)
        self.addImageLayer("thumbnailtmp/thumb.jpg",bbox,"thumb")
        self.showLayer()

    def attributesTostring(self):
        wynik = ''
        for k, v in self.attribs.items():
            wynik += k + ":'" + v + "',"
        return (wynik[:-1])

    def addImageLayer(self, url, bounds, name, attrib=-1):
        if (attrib != -1):
            self.wmsAttribs = attrib
        self.name = name
        self.url = url
        self.bounds = bounds

    def showLayer(self):
        self.htm = '''<script type="text/javascript">Jupytepide.map_addImageLayer("%s",%s,'%s',{%s});</script>''' \
                   % (self.url, self.bounds, self.name, self.attributesTostring())
        display(HTML(self.htm))

    def removeLayer(self):
        htm = '''<script type="text/javascript">Jupytepide.map_removeLayer("%s");</script>''' %self.name
        display(HTML(htm))

    def changeAttributes(self, name, value):
        self.attribs[name] = value



def Main():
    ll = Leaflet()
    geojsonFeature = {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [[17.06101, 51.1093], [17.06691, 51.10739], [17.06581, 51.10691]]
            ]
        },
        "properties": {
            "description": "value0",
            "prop1": {"this": "that"}
        }
    }


if __name__ == '__main__':
    Main()
