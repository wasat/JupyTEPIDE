// file source_UI/toolbar_items.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// To see where are all extensions loaded use:
// 'jupyter notebook list'
// look also:
// '/home/michal/.local/share/jupyter/nbextensions/'
// ---------------------------------------------------------------------------
// Toobar icons adding
//

define([
    'base/js/namespace'
], function(
    Jupyter
) {
    //***
    //*** Action Handlers ***
    //Function objects for handling actions performed by tool-buttons click
    var komunikat_handler = function () {
        alert('To jest moj komunikat po polskuuuuu!');
    };

    var komunikat2_handler = function() {
        alert('To jest komunikat nr 2');
    };

    //*** make_action ***
    //Function for action preparing
    function make_action(action_name,prefix,icon_,help_,help_index_,handler_){
        var action = {
            icon: icon_,//'fa-comment-o', // a font-awesome class used on buttons, etc
            help: help_,//'Pokaz komunikatttttt',
            help_index : help_index_,//'to by mogla byc pomoc',
            handler : handler_//handler
        };
        var action_made = Jupyter.actions.register(action, action_name, prefix);
        return action_made;

    }
    //***

    //*** load_ipython_extension ***
    // Extension loader
    function load_ipython_extension() {

        //Prepare actions for tool-buttons
        var komunikat = make_action('komunikat1', 'my_ext','fa-comment-o','Pokaz komunikat1','to jest komunikat1',komunikat_handler);
        var komunikat2 = make_action('komunikat2', 'my_ext2','fa-comment-o','Pokaz komunikat2','to jest komunikat2',komunikat2_handler);
        //Load buttons to UI
        Jupyter.toolbar.add_buttons_group([komunikat, komunikat2]);

    }
    return {
        load_ipython_extension: load_ipython_extension
    };
});