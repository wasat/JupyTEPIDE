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
], function(
    Jupyter,
    $,
    require
) {
   var load_style = function() {
        //var text = require.toUrl('../../components/codemirror/theme/'+'aaa'+'.css');
        //alert(text);
        //var css=Jupyter.notebook.get_cell(0);
        //alert(css);

        //styl codemirrora
        var $tlink = $('<link/>');
        $('head').append($tlink);

        try{
                 $tlink.attr('href',require.toUrl('../../components/codemirror/theme/'+'monokai'+'.css'))
                     .attr('rel','stylesheet')
                     .attr('type','text/css');

            for(var c in IPython.notebook.get_cells()){
                         Jupyter.notebook.get_cell(c).code_mirror.setOption('theme', 'monokai')
            }
        } catch(e){}

        //styl skórki jupytera (patrz inne pliki w katalogu ./css/)
        var $link = $('<link/>');
        $('head').append($link);

        //podstawiam inny bootstrap niż jest - spr z innym jquery tak samo z innymi już istniejącymi jupytera
        //można pozmieniać im nazwy plików, żeby się nie mieszały, ale namespace zostaną te same i się nadpiszą
        $link.attr('href',require.toUrl('./css/'+'bootstrap.min'+'.css'))
            .attr('rel','stylesheet')
            .attr('type','text/css');

       //styl jupyTEPIDE
       var $jlink = $('<link/>');
       $('head').append($jlink);

       //podstawiam inny bootstrap niż jest - spr z innym jquery tak samo z innymi już istniejącymi jupytera
       //można pozmieniać im nazwy plików, żeby się nie mieszały, ale namespace zostaną te same i się nadpiszą
       $jlink.attr('href',require.toUrl('./css/'+'jupytepide'+'.css'))
           .attr('rel','stylesheet')
           .attr('type','text/css');

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
    function make_action(action_name,prefix,icon_,help_,help_index_,handler_){
        var action = {
            icon: icon_,
            help: help_,
            help_index : help_index_,
            handler : handler_
        };
        var action_made = Jupyter.actions.register(action, action_name, prefix);
        return action_made;

    }
    //***

    //*** load_ipython_extension ***
    // Extension loader
    function load_ipython_extension() {
        var action_load_style = make_action('komunikat3', 'my_ext2','fa-css3','Zmien styl','to jest komunikat3',load_style);

        //Load button to UI
        Jupyter.toolbar.add_buttons_group([action_load_style]);

    }
    return {
        load_ipython_extension: load_ipython_extension
    };
});