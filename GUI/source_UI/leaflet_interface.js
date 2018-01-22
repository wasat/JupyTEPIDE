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

    //Adding this method to String.rototype to implement string formatting
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

    var load_map = function(map_container) {
        mymap = L.map(map_container).setView([0,0], 1).on('click', onMapClick);
        Jupytepide.leafletMap = mymap;
    };

    //call example - look at load_mapboxLayer
    var load_layer = function(url_,atrib) {
        L.tileLayer(url_, atrib).addTo(Jupytepide.leafletMap);
    };

    //initial map loaded into Jupytepide UI
    var load_mapboxLayer = function() {
        load_layer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        });

        set_view([52,21],3);
    };

    var set_view = function(center,zoom){
        Jupytepide.leafletMap.setView(center, zoom);
    };

    var markerIcon = L.icon({
        iconUrl: '/nbextensions/source_UI/img/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
        shadowUrl: '/nbextensions/source_UI/img/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
    });

        //example: center=[51.11134, 17.0343], popup_={title: 'Wrocław',text:'Miasto w Polsce'}
    var add_marker = function(center,popup_) {
        var html_popup = "<b>{0}</b><br />{1}".format(popup_.title,popup_.text);
        var parameters={icon: markerIcon}
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

    //center=[52.407, 21.33], radius=500, popup_="Some text", parameters_={color: 'red', fillColor: '#f03', fillOpacity: 0.5}
    var add_circle = function(center,radius,popup_,parameters_){
        L.circle(center, radius, parameters_).addTo(Jupytepide.leafletMap).bindPopup(popup_);
    };

    //points=[[51.1092, 17.06108],[51.10734, 17.06698],[51.10697, 17.06587]], popup="Some text"
    var add_polygon = function(points,popup_){
        L.polygon(points).addTo(Jupytepide.leafletMap).bindPopup(popup_);
    };

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
        load_layer:load_layer,
        load_mapboxLayer:load_mapboxLayer,
        set_view:set_view,
        add_marker:add_marker,
        add_circle:add_circle,
        add_polygon:add_polygon
    };

});




