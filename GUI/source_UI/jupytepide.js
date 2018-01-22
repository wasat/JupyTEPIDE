// file source_UI/jupytepide.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
// Jupytepide main object
//TODO: dać tu zawartość modułu jupytepide_notebooks
//TODO: pospinać jak najwięcej uniwersalnych funkcji z metodami tego obiektu

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

    //points=[[51.1092, 17.06108],[51.10734, 17.06698],[51.10697, 17.06587]], popup="Some text"
    Jupytepide.map_addPolygon = function(points,popup_){
        leaflet_interface.add_polygon(points,popup_);
    };

    // return public object
    return Jupytepide

});