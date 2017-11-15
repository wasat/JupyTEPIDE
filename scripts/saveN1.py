#!/opt/anaconda/anaconda3/envs/python34/bin/python
import numpy as np
import sys
from PIL import Image
from os import path
from snappy import ProductIO

nowa = sys.argv[1].replace('/', '_')
nowa = path.join('/opt/tmp', nowa + '.jpg')
if not path.isfile(nowa):
    p = ProductIO.readProduct(sys.argv[1])
    rad13 = p.getBand('radiance_13')
    w = rad13.getRasterWidth()
    h = rad13.getRasterHeight()
    rad13_data = np.zeros(w * h, np.float32)
    rad13.readPixels(0, 0, w, h, rad13_data)
    p.dispose()
    rad13_data.shape = h, w
    im = Image.fromarray(rad13_data)
    if im.mode != 'RGB':
        im = im.convert('RGB')
    im.thumbnail((300, 300 * w / h))
    im.save(nowa, "JPEG")
else:
    print("Thumbnail already exists...")
