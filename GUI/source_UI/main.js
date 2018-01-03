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
        './menu',
        './toolbar_items',
        './panel_browser',
        './map_browser',
        './css_loader',
        './code_snippets'
    ],
    function (menu,
              toolbar_items,
              panel_browser,
              map_browser,
              css_loader,
              code_snippets) {
        css_loader.load_jupytepide_theme();
        menu.load_ipython_extension();
        map_browser.load_ipython_extension();
        code_snippets.load_ipython_extension();
        //css_loader.load_ipython_extension();

        toolbar_items.load_ipython_extension();
        panel_browser.load_ipython_extension();


    });