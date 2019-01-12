//import {load_leaflet} from '/nbextensions/source_UI/leaflet_interface.js';

// file jupytepide/main.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
//Extension for User Interface JupytepIDE
//Main file
//TODO: place text messages and other resources in shared JS file (resources)

define([
        './jupytepide', //main Jupytepide object
        './menu',
        './toolbar_items',
        './panel_browser',
        './map_browser',
        './css_loader',
        './code_snippets'
    ],
    function (jupy,
              menu,
              toolbar_items,
              panel_browser,
              map_browser,
              css_loader,
              code_snippets
    ) {
        css_loader.load_jupytepide_theme();
        //css_loader.load_ipython_extension(); //this can be used to add button for loading style manually
        menu.load_ipython_extension();
        code_snippets.load_ipython_extension();
        toolbar_items.load_ipython_extension();
        panel_browser.load_ipython_extension();
    });