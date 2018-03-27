// file source_UI/leaflet_interface.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
// Interface for leaflet.js map component library
//todo: podpiąć jak najwięcej funkcji leafleta i przekazać do obiektu Jupytepide (jupytepide.js)

define([
    'base/js/namespace',
    'jquery',
    'require',
    './ol',
    './code_snippets',
    './leaflet'

], function (Jupyter,
             $,
             require,
             ol,
             code_snippets,
             L

) {

    //Adding this method to String.prototype to implement string formatting
    // (I could use template strings of course, but this I'm more sure of)
    String.prototype.format = function() {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{'+i+'\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };

    var mymap;

    //*** load_map ***
    //Used for initial map loading (not for notebook users)
    //Jupytepide.leafletMap initialization
    var load_map = function(map_container) {
        mymap = L.map(map_container);
        Jupytepide.leafletMap = mymap;
        //Jupytepide.leafletMap.on('resize',function(){Jupytepide.leafletMap.invalidateSize();});
        //Jupytepide.leafletMap.whenReady(function(){alert("gggggggd")});
        Jupytepide.leafletMap.setView([0, 0], 1).on('click', onMapClick);
        //Jupytepide.leafletMap.fire('resize');
        L.control.scale().addTo(Jupytepide.leafletMap);
    };

    var map_invalidateSize = function () {
        //Jupytepide.leafletMap.invalidateSize();
        mymap.invalidateSize();
    };



    //*** load_layer ***
    //call example - look at load_mapboxLayer
    //example:  url_='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    //          atrib_={maxZoom:18, attribution:'copyrights etc...',id:'mapbox.streets'}
    var load_tileLayer = function(url_,atrib) {
        return L.tileLayer(url_, atrib).addTo(Jupytepide.leafletMap);
    };

    //*** load_wmsLayer ***
    //example: url='https://demo.boundlessgeo.com/geoserver/ows?', atrib={layers:'ne:ne'}, more options: http://leafletjs.com/reference-1.3.0.html#tilelayer-wms
    var load_wmsLayer = function (url_,atrib){
        return L.tileLayer.wms(url_,atrib).addTo(Jupytepide.leafletMap);

    };

    //*** load_geoJsonLayer ***
    var load_geoJsonLayer = function(data,options){
        return L.geoJSON(data,options
        ).bindPopup(function(layer){
           return layer.feature.properties.description;
        }).addTo(Jupytepide.leafletMap);

        //return L.geoJSON(data).addTo(Jupytepide.leafletMap);
    };

    //*** load_imageLayer ***
    //example: imageUrl = '/nbextensions/source_UI/img/raster-1.jpg', imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
    var load_imageLayer = function(imageUrl,imageBounds,options){
        return L.imageOverlay(imageUrl,imageBounds,options).addTo(Jupytepide.leafletMap);

    };

    //*** load_mapboxLayer ***
    //initial map loaded into Jupytepide UI
    var load_mapboxLayer = function() {
        load_tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        });

        set_view([52,21],3);
    };

    //*** load_initialBaseLayers ***
    var load_initialBaseLayers = function() {
        Jupytepide.leafletMap.layers = {};

        Jupytepide.leafletMap.layers.mapbox = load_tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        });

        Jupytepide.leafletMap.layers.osm = load_tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        });


        var baseLayers = {

            "Mapbox:streets":Jupytepide.leafletMap.layers.mapbox,
            "OSM":Jupytepide.leafletMap.layers.osm
        };

        var overlays ={};

        Jupytepide.leafletMap.control = add_layerControls(baseLayers,overlays);

        set_view([52,21],3);
    };

    //*** set_view ***
    var set_view = function(center,zoom){
        Jupytepide.leafletMap.setView(center, zoom);
    };

    // //*** layer_moveUp ***
    // var layer_moveUp = function(layer){
    //     layer.options.zIndex = layer.options.zIndex+1;
    // };
    //
    // //*** layer_moveDown ***
    // var layer_moveDown = function(layer){
    //     layer.options.zIndex = layer.options.zIndex-1;
    // };

    //*** markerIcon ***
    var markerIcon = L.icon({
        iconUrl: '/nbextensions/source_UI/img/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
        shadowUrl: '/nbextensions/source_UI/img/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
    });

    //*** add_marker ***
        //example: center=[51.11134, 17.0343], popup_={title: 'Wrocław',text:'Miasto w Polsce'}
    var add_marker = function(center,popup_) {
        var html_popup = "<b>{0}</b><br />{1}".format(popup_.title,popup_.text);
        var parameters = {icon: markerIcon};
        L.marker(center, parameters).addTo(Jupytepide.leafletMap)
            .bindPopup(html_popup);
    };

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(Jupytepide.leafletMap);
    }

    //*** add_circle ***
    //center=[52.407, 21.33], radius=500, popup_="Some text", parameters_={color: 'red', fillColor: '#f03', fillOpacity: 0.5}
    var add_circle = function(center,radius,popup_,parameters_){
        return L.circle(center, radius, parameters_).addTo(Jupytepide.leafletMap).bindPopup(popup_);
    };

    //*** add_polygon ***
    //points=[[51.1092, 17.06108],[51.10734, 17.06698],[51.10697, 17.06587]], popup="Some text", parameters_={color: 'red', fillColor: '#f03', fillOpacity: 0.5}
    var add_polygon = function(points,popup_,parameters_){
        return L.polygon(points,parameters_).addTo(Jupytepide.leafletMap).bindPopup(popup_);
    };

    //*** add_polyline ***
    //latlngs=[[17.06101,51.1093],[17.06691,51.10739],[17.06581,51.10691]], options={color:'red'}, popup='linijka'
    var add_polyline = function(latlngs,options,popup_){
        return L.polyline(latlngs,options).addTo(Jupytepide.leafletMap).bindPopup(popup_);
    };

    //*** add_layerControls ***
    var add_layerControls = function(baseLayers,overlays){
        return L.control.layers(baseLayers,overlays,{collapsed:true}).addTo(Jupytepide.leafletMap);

    };

    //*** add_controlBaseLayer ***
    //Add a base layer instance to control.layers (radio button entry)
    var add_controlBaseLayer = function(Layer,name){
        //L.control.addBaseLayer(Layer,name);
    };

    //*** add_controlBaseLayer ***
    //Add an overlay layer instance to control.layers (check box entry)
    var add_controlOverlayLayer = function(Layer,name){
        //L.control.addOverlay(Layer,name);
    };

    var remove_controlLayer = function(Layer){
       // L.control.removeLayer(Layer);
    };

    //****** testing area **********************************************************************************************

    //load ownTiles
    var load_madrid = function(){
        return L.tileLayer('/nbextensions/source_UI/madrid/{z}/{x}/{y}.png', {
            tms:true,
            opacity:0.8,
            attribution: ''
        }).addTo(Jupytepide.leafletMap)
    };

    //load IMAGE
    var load_image = function(){
        //ta funkcja działa z jpg, nie działa z geotiff
        //todo: można zrobić ładowanie geotiff na podobę: https://github.com/stuartmatthews/leaflet-geotiff
        //todo: albo pociąć na tilesy i czytać przez loadTile(): http://build-failed.blogspot.it/2012/11/zoomable-image-with-leaflet.html

        //nbextensions/source_UI/img/marker-icon.png

        // var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
        //     imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];

        var imageUrl = '/nbextensions/source_UI/img/raster-1.jpg',
            imageBounds = [[51.712216, 17.22655], [51.773941, 17.12544]];

        L.imageOverlay(imageUrl,imageBounds,{opacity:0.5}).addTo(Jupytepide.leafletMap);
        set_view([51.712216, 17.22655],12);
    };

    //load JSON
    var load_geojson = function(){
        var geojsonFeature ={
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [ [51.1093, 17.06101],[51.10739, 17.06691],[51.10691, 17.06581] ]
                ]
            },
            "properties": {
                "description": "value0",
                "prop1": {"this": "that"}
            }
        };

        L.geoJSON(geojsonFeature).addTo(Jupytepide.leafletMap);
        set_view([17.06101,51.1093],16);
    };

    //*** load_leaflet ***
    //function for testing purposes - delete when finished
    var load_leaflet = function () {
        mymap = L.map("map_container").setView([51.505, -0.09], 13);
        Jupytepide.leafletMap = mymap;

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(mymap);

        var myIcon = L.icon({
            iconUrl: '/nbextensions/source_UI/img/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -41],
            shadowUrl: '/nbextensions/source_UI/img/marker-shadow.png',
            shadowSize: [41, 41],
            shadowAnchor: [12, 41]
        });

        //leaflet.marker([51.5, -0.09],{icon: myIcon}).addTo(mymap)
        //    .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

        L.marker([51.5, -0.09], {icon: myIcon}).addTo(mymap)
            .bindPopup("<b>Hello world!</b><br />I am a popup.");

        L.circle([51.508, -0.11], 500, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).addTo(mymap).bindPopup("I am a circle.");

        L.polygon([
            [51.509, -0.08],
            [51.503, -0.06],
            [51.51, -0.047]
        ]).addTo(mymap).bindPopup("I am a polygon.");


        var popup = L.popup();

        function onMapClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(mymap);
        }

        mymap.on('click', onMapClick);

    };

    var load_test_polygon = function(popupText){
        L.polygon([
            [51.51863, -0.18488],
            [51.50165, -0.2029],
            [51.49577, -0.15003]
        ]).addTo(Jupytepide.leafletMap).bindPopup(popupText);

    };

    return {
        load_leaflet:load_leaflet,
        load_test_polygon:load_test_polygon,
        load_map:load_map,
        load_initialBaseLayers:load_initialBaseLayers,
        load_tileLayer:load_tileLayer,
        load_wmsLayer:load_wmsLayer,
        load_geoJsonLayer:load_geoJsonLayer,
        load_imageLayer:load_imageLayer,
        load_mapboxLayer:load_mapboxLayer,
        set_view:set_view,
        add_marker:add_marker,
        add_circle:add_circle,
        add_polygon:add_polygon,
        add_polyline:add_polyline,
        add_layerControls:add_layerControls,
        add_controlBaseLayer:add_controlBaseLayer,
        add_controlOverlayLayer:add_controlOverlayLayer,
        remove_controlLayer:remove_controlLayer,
        load_geojson:load_geojson,
        load_image:load_image,
        load_madrid: load_madrid,
        map_invalidateSize: map_invalidateSize

    };

});




