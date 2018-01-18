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

    var load_test_polygon = function(){
        L.polygon([
            [51.51863, -0.18488],
            [51.50165, -0.2029],
            [51.49577, -0.15003]
        ]).addTo(Jupytepide.leafletMap).bindPopup("I am a polygon.");

    };

    return {
        load_leaflet:load_leaflet,
        load_test_polygon:load_test_polygon
    };

});




