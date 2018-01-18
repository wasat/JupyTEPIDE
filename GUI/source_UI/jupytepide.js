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

    Jupytepide.map_LoadPolygon = function(){
        leaflet_interface.load_test_polygon();
    };

    // return public object
    return Jupytepide

});