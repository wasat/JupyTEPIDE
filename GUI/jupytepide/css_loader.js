// File source_UI/css_loader.js
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
    'require',
    'notebook/js/actions'
], function (Jupyter,
             $,
             require,
             actions) {

    //CSS style loading for JupyTEPIDE theme
    //all styles stored in ./css/ folder

    var overrideJupyterActions = function(themeName){

        //Add code mirror style loading to every cell-inserting action
        //this is inserting by mouse clicking on buttons or list elements
        $('a.dropdown-toggle').click(function(){
            //turn off all onclick events on paste_cell action li menu positions
            $('li[id^="paste_cell"]').off('click');

            //override onclick events on paste_cell action li menu positions with code mirror mbo style
            $('li[id="paste_cell_above"]').click(function(){
                Jupyter.notebook.paste_cell_above();
                Jupyter.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
            });
            $('li[id="paste_cell_below"]').click(function(){
                Jupyter.notebook.paste_cell_below();
                Jupyter.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
            });
            $('li[id="paste_cell_replace"]').click(function(){
                Jupyter.notebook.paste_cell_replace();
                Jupyter.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
            });
        });
       //this is inserting by code keys actions
        //it is needed to replace action handler function for each action which inserts a cell
        var Jupyter_actions = Object.getPrototypeOf(Jupyter.actions);
        Jupyter_actions._actions["jupyter-notebook:insert-cell-above"].handler = function (env) {
            env.notebook.insert_cell_above();
            env.notebook.select_prev(true);
            env.notebook.focus_cell();
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:insert-cell-below"].handler = function (env) {
            env.notebook.insert_cell_below();
            env.notebook.select_next(true);
            env.notebook.focus_cell();
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:paste-cell-below"].handler = function (env) {
            env.notebook.paste_cell_below();
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:paste-cell-above"].handler = function (env) {
            env.notebook.paste_cell_above();
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:change-cell-to-code"].handler = function (env) {
            env.notebook.cells_to_code();
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:change-cell-to-markdown"].handler = function (env) {
            env.notebook.cells_to_markdown();
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:change-cell-to-raw"].handler = function (env) {
            env.notebook.cells_to_raw();
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:change-cell-to-heading-1"].handler = function (env) {
            env.notebook.to_heading(undefined, 1);
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:change-cell-to-heading-2"].handler = function (env) {
            env.notebook.to_heading(undefined, 2);
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:change-cell-to-heading-3"].handler = function (env) {
            env.notebook.to_heading(undefined, 3);
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:change-cell-to-heading-4"].handler = function (env) {
            env.notebook.to_heading(undefined, 4);
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:change-cell-to-heading-5"].handler = function (env) {
            env.notebook.to_heading(undefined, 5);
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:change-cell-to-heading-6"].handler = function (env) {
            env.notebook.to_heading(undefined, 6);
            env.notebook.get_selected_cell().code_mirror.setOption('theme', themeName);
        };

        Jupyter_actions._actions["jupyter-notebook:undo-cell-deletion"].handler = function (env) {
            env.notebook.undelete_cell();
            styleAllCells(themeName);
        };
    };

    //sets code mirror mbo style to all cells in notebook
    var styleAllCells = function(themeName){
        try {
          for (var c in IPython.notebook.get_cells()) {
              Jupyter.notebook.get_cell(c).code_mirror.setOption('theme', themeName)
          }
        }
        catch(e){}

    }

    var load_style = function () {

        //Codemirror style
        var $tlink = $('<link/>');
        $('head').append($tlink);

        try {
            $tlink.attr('href', require.toUrl('../../components/codemirror/theme/' + 'mbo' + '.css'))
                .attr('rel', 'stylesheet')
                .attr('type', 'text/css'); //monokai
            styleAllCells('mbo');
        } catch (e) {
        }

        //Add code mirror style loading to every cell-inserting action
        overrideJupyterActions('mbo');

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
        //#$('body').append($('<script/>',{
        //#    src: require.toUrl('./drag-arrange.min.js')
        //#}));


        //new combobox in bootstrap style
        //$('select').appendTo('<div/>');

        //logo
        $('#ipython_notebook img').attr('src', require.toUrl('./img/logo_jupytepide.png')).attr('alt', 'JupyTEP IDE');

        //Leaflet map JS library style
        $('head').append($('<link/>').attr('href', require.toUrl('./css/' + 'leaflet' + '.css'))
            .attr('rel', 'stylesheet')
            .attr('type', 'text/css'));


        //Leaflet drawing and editing tools plugin
        $('body').append($('<script/>',{
            src: require.toUrl('./leaflet.pm.min.js')
        }));

        //Leaflet.pm - Leaflet plugin library style
        $('head').append($('<link/>').attr('href', require.toUrl('./css/' + 'leaflet.pm' + '.css'))
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