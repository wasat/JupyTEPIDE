//import {load_leaflet} from '/nbextensions/source_UI/leaflet_interface.js';

// file source_UI/main.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
//Extension for User Interface JupytepIDE
//Main file
//TODO: przeniesc komunikaty i inne zasoby do wspolnego pliku (resources)


define([
        './jupytepide', //main Jupytepide object
        './menu',
        './toolbar_items',
        './panel_browser',
        './map_browser',
        './css_loader',
        './code_snippets',
        'jquery',
        'require',
        './leaflet_interface'
    ],
    function (jupy,
              menu,
              toolbar_items,
              panel_browser,
              map_browser,
              css_loader,
              code_snippets,
              $,
              require,
              leaflet_interface) {
        css_loader.load_jupytepide_theme();
        menu.load_ipython_extension();
        //map_browser.load_ipython_extension(); //ładowanie przeniesione do panel_browser
        code_snippets.load_ipython_extension();
        //css_loader.load_ipython_extension();

        toolbar_items.load_ipython_extension();
        panel_browser.load_ipython_extension();
        //$( document ).ready(function() {
        //leaflet_interface.map_invalidateSize();
        //Jupytepide.leafletMap.invalidateSize();
        //});

    });


