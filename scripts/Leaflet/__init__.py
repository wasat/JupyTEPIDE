from IPython.display import HTML,display

class Leaflet():

    wmsAttribs={
        'layers':'',
        'styles':'',
        'format':'image/png',
        'transparent':True,
        'version':'1.1.1',
        'crs':'null',
        'uppercase':False
    }

    params={
        'color': 'red',
        'fillColor': '#f03',
        'fillOpacity': 0.5
    }

    def _attrib2string(self):
        ls=[]
        for k,v in self.wmsAttribs.items():
            s = ''
            if type(v)==bool:
                val=str(v).lower()
            else:
                val='\''+v+'\''
            s+=k+':'+val
            ls.append(s)
        s=','.join(ls)
        return s

    def _dict2string(self,d):
        ls = []
        for k, v in d:
            s = ''
            if type(v) == bool:
                val = str(v).lower()
            elif isinstance(v,str):
                val = '\'' + v + '\''
            else:
                val = str(v)
            s += k + ':' + val
            ls.append(s)
        s = ','.join(ls)
        return s

    def setView(self,B,L,zoom):
        htm='''<script type="text/javascript">Jupytepide.map_setView([%f,%f],%f);</script>'''%(B,L,zoom)
        display(HTML(htm))

    def addRasterLayer(self): #TODO: dorobic rastra
        pass

    def addJsonLayer(self,j): #TODO: dorobic geojsona
        pass

    def addCircle(self,x,y,r,popup='',params=-1):
        if params==-1:
            params=self.params
        htm = '''<script type="text/javascript">Jupytepide.map_addCircle([%f,%f],%f,%s,{%s});</script>''' % (x, y,r, popup,params)
        display(HTML(htm))

    def addMarker(self,x,y,popup='{title:\'Marker\', text:\'Marker\'}'):
        htm = '''<script type="text/javascript">Jupytepide.map_addMarker([%f,%f],%s);</script>''' % (x, y, popup)
        display(HTML(htm))

    def addPolygon(self,x,y,popup=''): #TODO: Dorobic polygona
        """
        :param x: list of x
        :param y: list of y
        :param popup: popup message
        :return:
        """
        s='['
        lista=[]
        lx=zip(x,y)
        for i in lx:
            lista.append('[%f,%f]'%(i[0],i[1]))
        s+=",".join(lista)
        s+=']'
        htm = '''<script type="text/javascript">Jupytepide.map_polygon(%s,%s);</script>''' % (s, popup)
        display(HTML(htm))

    def addPolygon(self,tupleXY,popup):
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

    def addWmsLayer(self,url,name,attrib=-1):

        if attrib==-1:
            attrib=self._attrib2string()
        elif isinstance(attrib,str):
            pass
        else:
            attrib=self._dict2string(attrib)

        htm = '''<script type="text/javascript">Jupytepide.map_addWmsLayer(%s,{%s},%s);</script>''' % (url, attrib, name)
        display(HTML(htm))

def Main():
    ll=Leaflet()
    print (ll._attrib2string())

if __name__ == '__main__':
    Main()