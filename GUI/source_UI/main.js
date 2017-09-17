// file source_UI/main.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
//Extension for User Interface JupytepIDE
//Main file

define([
    './menu',
    './toolbar_items',
    './panel_browser'
],
    function(
        menu,
        toolbar_items,
        panel_browser
    ){
    menu.load_ipython_extension();
    toolbar_items.load_ipython_extension();
    panel_browser.load_ipython_extension();

});