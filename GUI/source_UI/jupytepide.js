// /** Module file source_UI/jupytepide.js
//  * Edited by: Michał Bednarczyk
//  * Copyright (C) 2017 .....
//  * Distributed under the terms of the BSD License.
//  * ---------------------------------------------------------------------------
//  * Jupytepide main object
//  */

//Generowanie dokumentacji:  jsdoc -d=doc jupytepide.js

//TODO: dać tu zawartość modułu jupytepide_notebooks
//TODO: pospinać jak najwięcej uniwersalnych funkcji z metodami tego obiektu

//todo:dorobić funkcję deleteAllLAyers - do usuwania wszystkich za pomocą each_Layer (leafleta) - przydatne gdy ktoś nie nada nazw tworzonym warstwom  i nie będzie mógł wywalić...
//todo:zrobić, żeby warstwy, które nie dostaną nazwy zostały ponumerowane, np.: Layer 1, itp.
//todo:nie pozwalać na wielokrotne dodawanie warstw o tej samej nazwie, bo potem nie chca się dać usunąć

/**
 * Jupytepide main object.
 * @class Jupytepide
 */
var Jupytepide = {version: '0.1.alpha'};

define([
    'jquery',
    'base/js/namespace',
    'base/js/dialog',
    'base/js/utils',
    'services/config',
    './leaflet_interface'
], function ($, Jupyter, dialog, utils, configmod, leaflet_interface) {
    "use strict";

    /**
     * Sets the map view at provided center point with defined zoom.
     * @example
     * // center=[51,17], zoom=9
     * Jupytepide.map_setView([51,17],9)
     * @method map_setView
     * @param center - An array of two [lat,lon] values.
     * @param zoom - Zoom ratio integer value.
     * @memberof: class:Jupytepide
     */

    Jupytepide.map_setView = function (center, zoom) {
        leaflet_interface.set_view(center, zoom);
    };

    /**
     * Adds a marker into the map.
     * @example
     * // center=[51.11134, 17.0343], popup_={title: 'Wrocław',text:'Miasto w Polsce'}
     * Jupytepide.map_addMarker([51.11134, 17.0343],{title: "Wrocław",text:"Miasto w Polsce"});
     * @param center - An array of two [lat,lon] values.
     * @param popup_ - Content of the popup.
     * @memberof: class:Jupytepide
     */

    Jupytepide.map_addMarker = function (center, popup_) {
        //todo: zrobić numerowanie markerów (innych elementów też, żeby je można było usuwać
        var layer_name = 'tmpMarker'
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.add_marker(center, popup_);
        ;
    };

    /**
     * Adds a circle into the map.
     * The layer name, into which polylane is added is set as "tmpCircle" by default and is not shown in layers list.
     * Refer to this name when you want to delete a circle from map.
     * @example
     * //center=[52.407, 21.33], radius=500, popup_="Some text",
     * //parameters_={color: 'red', fillColor: '#f03', fillOpacity: 0.5}
     * Jupytepide.map_addCircle([52.407, 21.33],500,"Some text",
     *          {color: 'red', fillColor: '#f03', fillOpacity: 0.5});
     * @param center - An array of two [lat,lon] values.
     * @param radius - Circle radius.
     * @param popup_ - Content of the popup.
     * @param parameters_ - Display parameters.
     * @memberof: class:Jupytepide
     */
    //center=[52.407, 21.33], radius=500, popup_="Some text", parameters_={color: 'red', fillColor: '#f03', fillOpacity: 0.5}
    Jupytepide.map_addCircle = function (center, radius, popup_, parameters_) {
        var layer_name = 'tmpCircle';
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.add_circle(center, radius, popup_, parameters_);

    };

    /**
     * Adds a polygon into the map.
     * The layer name, into which polylane is added is set as "tmpPolygon" by default and is not shown in layers list.
     * Refer to this name when you want to delete a polygon from map.
     * @example
     * //points=[[51.1092, 17.06108],[51.10734, 17.06698],[51.10697, 17.06587]],
     * //popup="Some text", parameters_={color: 'red',
     * //                           fillColor: '#f03', fillOpacity: 0.5}
     * Jupytepide.map_addPolygon([[51.1092, 17.06108],[51.10734, 17.06698],[51.10697, 17.06587]],
     *      "tekst",{color: 'red', fillColor: '#f03', fillOpacity: 0.5});
     * @param points - An array of vertex's [lat,lon] coordinates.
     * @param popup_ - Content of the popup.
     * @param parameters_ - Display parameters.
     * @memberof: class:Jupytepide
     */

    Jupytepide.map_addPolygon = function (points, popup_, parameters_) {
        var layer_name = 'tmpPolygon';
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.add_polygon(points, popup_, parameters_);

    };

    /**
     * Adds a polyline into the map.
     * The layer name, into which polylane is added is set as "tmpPolyline" by default and is not shown in layers list.
     * Refer to this name when you want to delete a polyline from map.
     * @example
     * //latlngs=[[17.06101,51.1093],[17.06691,51.10739],[17.06581,51.10691]], options={color:'red'}, popup='linijka'
     * Jupytepide.map_addPolyline([ [17.06101,51.1093],[17.06691,51.10739],[17.06581,51.10691] ],{color:'red'},'linijka');
     * @param latlngs - An array of vertex'es [lat,lon] coordinates.
     * @param options - Display parameters.
     * @param popup_ - Content of the popup.
     * @memberof: class:Jupytepide
     */
    //nazwa warstwy, do której dodana jest polilinia to 'tmpPolyline'. Podana jest na stałe i do tej nazwy należy się odwoływac podczas usuwania
    Jupytepide.map_addPolyline = function (latlngs, options, popup_) {
        var layer_name = 'tmpPolyline';
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.add_polyline(latlngs, options, popup_);

    };

    /**
     * Adds a WMS layer into the map.
     * @example
     * Jupytepide.map_addWmsLayer(
     *   'http://mapy.geoportal.gov.pl/wss/service/img/guest/Administracyjna/MapServer/WMSServer',
     *   {layers:'Administracyjna', opacity:1},'Administracyjna');
     * @example
     * Jupytepide.map_addWmsLayer(
     *  'http://mapy.geoportal.gov.pl/wss/service/pub/guest/kompozycjaG2_VMAPL2_WMS/MapServer/WMSServer',
     *  {layers:'Jezdnia_dr_gl_L,Jezdnia_dr_zb_L,Jezdnia_drogi_eksp_L',
     *   opacity:1, transparent:'true',format:'image/png'},'drogi');
     * @param url_ - URL of WMS service.
     * @param attrib - WMS attributes.
     * @param layer_name - Jupytepide (not WMS) layer name, which will appear on the layers list after loading.
     * @memberof: class:Jupytepide
     */

    //example: url='https://demo.boundlessgeo.com/geoserver/ows?', atrib={layers:'ne:ne'}, more options: http://leafletjs.com/reference-1.3.0.html#tilelayer-wms
    Jupytepide.map_addWmsLayer = function (url_, attrib, layer_name) {
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_wmsLayer(url_, attrib);
        //dodaje do control.layers (do menu z checkboxem)
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name], layer_name);
    };

    /**
     * Adds a TMS (tiled) layer into the map.
     * @example
     * //url='/nbextensions/source_UI/madrid/{z}/{x}/{y}.png'
     * Jupytepide.map_addTileLayer('http://localhost:8888/tree/aa_notebooks/madrid/{z}/{x}/{y}.png',
     *   {maxZoom:20,attribution:"",tms:true},"madrid");
     * @param url_ - URL of TMS service od catalog.
     * @param attrib - TMS attributes.
     * @param layer_name - Jupytepide (not TMS) layer name, which will appear on the layers list after loading.
     * @memberof: class:Jupytepide
     */

    //example:  url_='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    //          attrib={maxZoom:18,attribution:"",id:'mapbox.streets'},
    //          layer_name="Layer name"
    //example2: url='/nbextensions/source_UI/madrid/{z}/{x}/{y}.png' - own (local) tile layer
    Jupytepide.map_addTileLayer = function (url_, attrib, layer_name) {
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_tileLayer(url_, attrib);
        //dodaje do control.layers (do menu z checkboxem)
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name], layer_name);
    };
    /**
     * Adds a GEOJSON vector layer into the map.
     * The simple example is provided here, but there are much more possibilities of usage.
     * Jupytepide leaflet-based map uses [lat,lon] while GEOJSON uses [lon,lat] coordinates.
     * More at: <a href="http://leafletjs.com/examples/geojson/">http://leafletjs.com/examples/geojson/</a>
     * @example
     * //first GEOJSON feature
     * var geojsonFeature ={
     * "type": "Feature",
     * "geometry": {
     * "type": "Polygon",
     * "coordinates": [[ [17.06101,51.1093],[17.06691,51.10739],[17.06581,51.10691] ]]
     * },
     * "properties": {
     * "description": "value0",
     * "prop1": {"this": "that"}
     * }
     * };
     *
     * //Then loading into map
     * Jupytepide.map_addGeoJsonLayer(geojsonFeature,"GEOJSON")
     * @example
     * //Or, when one wants to set up some display parameters
     * var myStyle = {"color": "#ff7800", "weight": 5, "opacity": 0.65};
     * Jupytepide.map_addGeoJsonLayer(geojsonFeature,"GEOJSON",{style: myStyle});
     * @param data - GEOJSON vector map data
     * @param layer_name - Jupytepide (not GEOJSON) layer name, which will appear on the layers list after loading.
     * @param options - Display options.
     * @memberof: class:Jupytepide
     */

    Jupytepide.map_addGeoJsonLayer = function (data, layer_name, options) {
        options == null ? {} : options;
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_geoJsonLayer(data, options);
        //dodaje do control.layers (do menu z checkboxem)
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name], layer_name);
    };

    /**
     * Adds an image raster layer into the map.
     * It won't work with geotif. For geotif use "map_addTileLayer" method.
     * @example
     * //imageUrl = '/nbextensions/source_UI/img/raster-1.jpg',
     * //imageBounds = [[51.712216, 17.22655], [51.773941, 17.12544]];
     * Jupytepide.map_addImageLayer(
     *        '/nbextensions/source_UI/img/raster-1.jpg',
     *        [[51.712216, 17.22655], [51.773941, 17.12544]];
     *        {opacity: 0.5});
     * @param imageUrl - URL of raster image.
     * @param imageBounds - Bounding coordinates of image in [lat,lon].
     * @param layer_name - Jupytepide layer name, which will appear on the layers list after loading.
     * @param options - Display options.
     * @memberof: class:Jupytepide
     */
    Jupytepide.map_addImageLayer = function (imageUrl, imageBounds, layer_name, options) {
        options == null ? {} : options;
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_imageLayer(imageUrl, imageBounds, options);
        //dodaje do control.layers (do menu z checkboxem)
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name], layer_name);
    };

    /**
     * Removes layer given by the "layer_name" from the map.
     * @example
     * //To remove layer named "tmpPolyline", call:
     * Jupytepide.map_removeLayer('tmpPolyline');
     * @param layer_name
     * @memberof: class:Jupytepide
     */
    //*** map_removeLayer ***
    Jupytepide.map_removeLayer = function (layer_name) {
        //remove layer from leaflet component
        Jupytepide.leafletMap.layers[layer_name].remove();
        //remove layer from control.layers
        Jupytepide.leafletMap.control.removeLayer(Jupytepide.leafletMap.layers[layer_name]);
        //remove layer from Jupytepide
        delete Jupytepide.leafletMap.layers[layer_name];
    };

    Jupytepide.map_addLayerControls = function (baseLayers, overlays) {
        Jupytepide.leafletMap.control = leaflet_interface.add_layerControls(baseLayers, overlays);
    };


    Jupytepide.map_addControlBaseLayer = function (Layer, name) {
        //Jupytepide.leafletMap.control.addBaseLayer(Layer,name);
    };

    Jupytepide.map_addControlOverlayLayer = function (Layer, name) {
        //Jupytepide.leafletMap.control.addOverlay(Layer,name);
    };

    Jupytepide.load_image = function () {
        leaflet_interface.load_image();
    };

    //*** testing area ***
    Jupytepide.load_madrid = function () {
        var layer_name = "Madryt";
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_madrid();
        //dodaje do control.layers (do menu z checkboxem)
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name], layer_name);
    };

    //method for testing
    Jupytepide.map_LoadPolygon = function (popupText) {
        leaflet_interface.load_test_polygon(popupText);
    };

    // return public object
    return Jupytepide

});