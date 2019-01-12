// File jupytepide/map_browser.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017-2019 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
// Map component configuration and preparation for loading in UI (in panel_browser.js)

define([
    'base/js/namespace',
    'jquery',
    'require',
    './ol',
    './code_snippets',
    './leaflet',
    './leaflet_interface'
], function (Jupyter,
             $,
             require,
             ol,
             code_snippets,
             leaflet,
             leaflet_interface
) {
    function build_map_panel() {
        //#map_panel element - for map containing
        //whole panel
        var map_panel = $('<div/>', {
            id: 'map_panel',
            class: 'map_panel',
            style: 'background-color:white; width:100%;height:100%;position:relative;'
        });

        //map
        var map_container = $('<div/>', {id: 'map_container', style: 'width:100%;height:100%;position:relative;'});

        //own (Jupytepide) control container
        var control_container = $('<div/>', {class: 'map_control_container'});

        map_panel.append(map_container);
        map_panel.append(control_container);

        return map_panel;
    };

    var leafletMap;

    function getLeafletMap() {
        return this.leafletMap;
    };

    //this is for loading map in panel_browser.js
    function load_extension() {
        var map_panel = build_map_panel();
        var main_panel = $('#notebook_panel');
        var flip = $('<div/>', {id: 'flip_map', class: 'container toolbar'});
        flip.append($('<button/>', {id: 'map_toggle', class: 'btn btn-xs btn-default'}).html('Hide/Show'));
        flip.append($('<a>', {name: 'map'}));

        flip.insertAfter(main_panel);
        //Insert panel with map
        map_panel.insertAfter(flip);
        map_panel.show();
        map_panel.slideToggle('medium');
        var visible = false;

        //load leaflet
        leaflet_interface.load_map("map_container");

        //load initial base layers
        leaflet_interface.load_initialBaseLayers();

        $('#map_toggle').click(function () {
            map_panel.slideToggle('medium');

            //if side pannel is turned on (then notebook panel has "scroll")
            if (!visible) {
                $('#notebook_panel').animate({
                    scrollTop: $('#notebook-container').height()
                }, 'medium');

                //when pannel is turned off (then site has "scroll")
                $('#site').animate({
                    scrollTop: $('#notebook-container').height()
                }, 'medium');
            }
            visible = !visible;
        });

    };

    // return public methods
    return {
        load_ipython_extension: load_extension,
        getLeafletMap: getLeafletMap,
        build_map_panel: build_map_panel
    };
});
