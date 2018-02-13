#!/opt/anaconda/anaconda3/envs/python34/bin/python

import sys
from collections import OrderedDict

import pandas as pd


class N1Metadata:
    SPH = OrderedDict()
    MPH = OrderedDict()
    DSD = OrderedDict()
    Quality_ADS = OrderedDict()
    Scaling_Factor_GADS = OrderedDict()
    Tie_points_ADS = OrderedDict()

    def __init__(self, filename):
        self.filename = filename
        if filename.upper().endswith('.N1'):
            self.readN1()
            print(self.html())
        elif "mtl" in filename.lower():
            self.readMTL()

    def readMTL(self):
        hht = ''
        try:
            with open(self.filename, 'r') as f:
                wiersze = f.readlines()
                f.close()
        except IOError:
            print("Error opening file....")
            return 0
        k = []
        v = []

        for i in wiersze[1:-2]:
            if i.upper().strip().startswith('GROUP'):
                hht += '<div style="float: left"><p><b>%s:</b></p>' % i.split('=')[1].strip()
                k = []
                v = []
            elif not i.upper().strip().startswith('END_GROUP'):
                t = [x.strip() for x in i.split('=')]
                if len(t) == 2:
                    k.append(t[0])
                    v.append(t[1].strip('"'))
            elif i.upper().strip().startswith('END_GROUP'):
                dd = {'Parameter': k, 'Value': v}
                df = pd.DataFrame(dd).to_html()
                hht += df
        print(hht)

    def readN1(self):
        import snappy
        try:
            self.product = snappy.ProductIO.readProduct(self.filename)
        except IOError:
            print("Error opening file....")
            return 0
        metadata = self.product.getMetadataRoot()
        element = metadata.getElement('SPH')
        for i in element.getAttributes():
            self.SPH[i.getName()] = i.getDataElems()[0]
        element = metadata.getElement('MPH')
        for i in element.getAttributes():
            self.MPH[i.getName()] = i.getDataElems()[0]
        element = metadata.getElement('DSD')
        for i in element.getAttributes():
            self.DSD[i.getName()] = i.getDataElems()[0]
        element = metadata.getElement('Quality_ADS')
        for i in element.getAttributes():
            self.Quality_ADS[i.getName()] = i.getDataElems()[0]
        element = metadata.getElement('Scaling_Factor_GADS')
        for i in element.getAttributes():
            self.Scaling_Factor_GADS[i.getName()] = i.getDataElems()[0]
        element = metadata.getElement('Tie_points_ADS')
        for i in element.getAttributes():
            self.Tie_points_ADS[i.getName()] = i.getDataElems()[0]

    def html(self):
        k = list(self.SPH.keys())
        v = list(self.SPH.values())
        dd = {'Parameter': k, 'Value': v}
        df1 = pd.DataFrame(dd).to_html()

        k = list(self.MPH.keys())
        v = list(self.MPH.values())
        dd = {'Parameter': k, 'Value': v}
        df2 = pd.DataFrame(dd).to_html()

        k = list(self.DSD.keys())
        v = list(self.DSD.values())
        dd = {'Parameter': k, 'Value': v}
        df3 = pd.DataFrame(dd).to_html()

        k = list(self.Quality_ADS.keys())
        v = list(self.Quality_ADS.values())
        dd = {'Parameter': k, 'Value': v}
        df4 = pd.DataFrame(dd).to_html()

        k = list(self.Scaling_Factor_GADS.keys())
        v = list(self.Scaling_Factor_GADS.values())
        dd = {'Parameter': k, 'Value': v}
        df5 = pd.DataFrame(dd).to_html()

        k = list(self.Tie_points_ADS.keys())
        v = list(self.Tie_points_ADS.values())
        dd = {'Parameter': k, 'Value': v}
        df6 = pd.DataFrame(dd).to_html()
        return '<div style="float: left"><p><b>SPH:</b></p>' + df1 + '<div style="float: left"><p><b>MPH:</b></p>' + df2 + '<div style="float: left"><p><b>DSD:</b></p>' + df3 + '<div style="float: left"><p><b>Quality_ADS:</b></p>' + df4 + '<div style="float: left"><p><b>Scaling_Factor_GADS:</b></p>' + df5 + '<div style="float: left"><p><b>Tie_points_ADS</b></p>' + df6

    def __repr__(self):
        from pprint import pprint
        from io import StringIO
        s = StringIO()
        pprint(self.SPH, s)
        m = StringIO()
        pprint(self.SPH, m)
        d = StringIO()
        pprint(self.DSD, d)
        Q = StringIO()
        pprint(self.Quality_ADS, Q)
        Sc = StringIO()
        pprint(self.Scaling_Factor_GADS, Sc)
        T = StringIO()
        pprint(self.Tie_points_ADS, T)
        return ('SPH:\n' + s.getvalue() + '\nMPH:\n' + m.getvalue() + '\nDSD:\n' + d.getvalue()
                + '\nQuality ADS:\n' + Q.getvalue() + '\nScaling Factor GADS:\n' + Sc.getvalue() + '\nTie points:\n' + T.getvalue())


if __name__ == "__main__":
    x = N1Metadata(sys.argv[1])

    # x=N1Metadata('LE71950301999190ESA00_MTL.txt')

    # print(N1Metadata(sys.argv[1]))
