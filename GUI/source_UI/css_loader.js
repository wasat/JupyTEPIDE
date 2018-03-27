// file source_UI/css_loader.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// To see where are all extensions loaded use:
// 'jupyter notebook list'
// look also (example dir):
// '/home/michal/.local/share/jupyter/nbextensions/'
// ---------------------------------------------------------------------------
// CSS loading
//

define([
    'base/js/namespace',
    'jquery',
    'require'
], function (Jupyter,
             $,
             require) {

    //CSS style loading for JupyTEPIDE theme
    //all styles stored in ./css/ folder
    var load_style = function () {

        //Codemirror style
        var $tlink = $('<link/>');
        $('head').append($tlink);

        try {
            $tlink.attr('href', require.toUrl('../../components/codemirror/theme/' + 'mbo' + '.css'))
                .attr('rel', 'stylesheet')
                .attr('type', 'text/css'); //monokai

            for (var c in IPython.notebook.get_cells()) {
                Jupyter.notebook.get_cell(c).code_mirror.setOption('theme', 'mbo')
            }
        } catch (e) {
        }

        //Jupyter theme style (look at folder ./css/)
        var $link = $('<link/>');
        //$('head').append($link);
        //$link.attr('href', require.toUrl('./css/' + 'bootstrap.min' + '.css'))
        //   .attr('rel', 'stylesheet')
        //    .attr('type', 'text/css');

        //jupyTEPIDE style
        var $jlink = $('<link/>');
        //$('head').append($jlink);

        $jlink.attr('href', require.toUrl('./css/' + 'jupytepide' + '.css'))
            .attr('rel', 'stylesheet')
            .attr('type', 'text/css');

        //OpenLayers style and scripts
        $('head').append($('<link/>', {
            href: 'https://openlayers.org/en/v4.4.2/css/ol.css',
            rel: 'stylesheet',
            type: 'text/css'
        }));
        //       The script below is only needed for old environments like Internet Explorer and Android 4.x
        $('head').append($('<script/>', {
            src: 'https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL'
        }));
        //OpenLayers script
        //   $('head').append($('<script/>',{
        //       src:'https://openlayers.org/en/v4.4.2/build/ol.js'
        //   }));

        ///drag-arrange.min.js script
        //rozszerzenie jquery do przesuwania elementów drag/drop - do wykorzystania - patrz przykład w /jquery_arrange_plugin/
        $('body').append($('<script/>',{
            src: require.toUrl('./drag-arrange.min.js')
        }));


        //new combobox in bootstrap style
        //$('select').appendTo('<div/>');

        //logo
        $('#ipython_notebook img').attr('src', require.toUrl('./img/logo_jupytepide.png')).attr('alt', 'JupyTEP IDE');

        //Leaflet map JS library style
        $('head').append($('<link/>').attr('href', require.toUrl('./css/' + 'leaflet' + '.css'))
            .attr('rel', 'stylesheet')
            .attr('type', 'text/css'));

        // $('body').append($('<script/>')).text('Jupytepide.leafletMap.invalidateSize();');
    };

    //*** make_action ***
    //Function for action preparing
    //In: Parameters to perform action.
    // action_name:string,
    // prefix:string,
    // icon_:string - icon name (font-awesome class used on buttons by Jupyter)
    // help_:string,
    // help_index_:string,
    // handler_: jscript function object to be performed by action
    //
    //Out: action_made
    // Jupyter registered action object
    function make_action(action_name, prefix, icon_, help_, help_index_, handler_) {
        var action = {
            icon: icon_,
            help: help_,
            help_index: help_index_,
            handler: handler_
        };
        var action_made = Jupyter.actions.register(action, action_name, prefix);
        return action_made;

    }

    //***

    //*** load_ipython_extension ***
    // Extension loader
    function load_ipython_extension() {
        var action_load_style = make_action('komunikat3', 'my_ext2', 'fa-css3', 'Zmien styl', 'to jest komunikat3', load_style);

        //Load button to UI
        Jupyter.toolbar.add_buttons_group([action_load_style]);

    }

    return {
        load_ipython_extension: load_ipython_extension,
        load_jupytepide_theme: load_style
    };
});