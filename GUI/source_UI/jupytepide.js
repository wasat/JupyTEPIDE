// file source_UI/jupytepide.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
// Jupytepide main object
//TODO: dać tu zawartość modułu jupytepide_notebooks
//TODO: pospinać jak najwięcej uniwersalnych funkcji z metodami tego obiektu

//todo:dorobić funkcję deleteAllLAyers - do usuwania wszystkich za pomocą each_Layer (leafleta) - przydatne gdy ktoś nie nada nazw tworzonym warstwom  i nie będzie mógł wywalić...
//todo:zrobić, żeby warstwy, które nie dostaną nazwy zostały ponumerowane, np.: Layer 1, itp.
//todo:nie pozwalać na wielokrotne dodawanie warstw o tej samej nazwie, bo potem nie chca się dać usunąć

var Jupytepide = Jupytepide || {};

define([
    'jquery',
    'base/js/namespace',
    'base/js/dialog',
    'base/js/utils',
    'services/config',
    './leaflet_interface'
], function ($, Jupyter, dialog, utils, configmod,leaflet_interface) {
    "use strict";

    Jupytepide.version='0.1.alpha';

    Jupytepide.getVersion = function(){
        return this.version;
    };

    //method for testing
    Jupytepide.map_LoadPolygon = function(popupText){
        leaflet_interface.load_test_polygon(popupText);
    };

    //eg.: center=[50,20], zoom=10
    Jupytepide.map_setView = function(center,zoom){
        leaflet_interface.set_view(center,zoom);
    };
    //example: center=[51.11134, 17.0343], popup_={title: 'Wrocław',text:'Miasto w Polsce'}
    Jupytepide.map_addMarker = function(center,popup_){
        leaflet_interface.add_marker(center,popup_);
    };

    //center=[52.407, 21.33], radius=500, popup_="Some text", parameters_={color: 'red', fillColor: '#f03', fillOpacity: 0.5}
    Jupytepide.map_addCircle = function(center,radius,popup_,parameters_){
        leaflet_interface.add_circle(center,radius,popup_,parameters_);
    };

    //points=[[51.1092, 17.06108],[51.10734, 17.06698],[51.10697, 17.06587]], popup="Some text", parameters_={color: 'red', fillColor: '#f03', fillOpacity: 0.5}
    Jupytepide.map_addPolygon = function(points,popup_,parameters_){
        leaflet_interface.add_polygon(points,popup_,parameters_);
    };

    //example: url='https://demo.boundlessgeo.com/geoserver/ows?', atrib={layers:'ne:ne'}, more options: http://leafletjs.com/reference-1.3.0.html#tilelayer-wms
    Jupytepide.map_addWmsLayer = function(url_,attrib,layer_name){
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_wmsLayer(url_,attrib);
        //dodaje do control.layers (do menu z checkboxem)
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],layer_name);
     };

    //example:  url_='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    //          attrib={maxZoom:18,attribution:"",id:'mapbox.streets'},
    //          layer_name="Layer name"
    Jupytepide.map_addTileLayer = function(url_,attrib,layer_name){
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_tileLayer(url_,attrib);
        //dodaje do control.layers (do menu z checkboxem)
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],layer_name);
    };

    //example:
    Jupytepide.map_addGeoJsonLayer = function(data,layer_name,options){
        options == null ? {} : options;
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_geoJsonLayer(data,options);
        //dodaje do control.layers (do menu z checkboxem)
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],layer_name);
    };


    //*** map_removeLayer ***
    Jupytepide.map_removeLayer = function(layer_name){
        //remove layer from leaflet component
        Jupytepide.leafletMap.layers[layer_name].remove();
        //remove layer from control.layers
        Jupytepide.leafletMap.control.removeLayer(Jupytepide.leafletMap.layers[layer_name]);
        //remove layer from Jupytepide
        delete Jupytepide.leafletMap.layers[layer_name];
    };

    Jupytepide.map_addLayerControls = function(baseLayers,overlays){
        Jupytepide.leafletMap.control = leaflet_interface.add_layerControls(baseLayers,overlays);
    };


    Jupytepide.map_addControlBaseLayer = function(Layer,name){
        //Jupytepide.leafletMap.control.addBaseLayer(Layer,name);
    };

    Jupytepide.map_addControlOverlayLayer = function(Layer,name){
        //Jupytepide.leafletMap.control.addOverlay(Layer,name);
    };


    // return public object
    return Jupytepide

});