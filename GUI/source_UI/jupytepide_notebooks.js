// file source_UI/jupytepide_notebooks.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
// Notebooks list loading

define([
    'jquery',
    'base/js/namespace',
    'base/js/dialog',
    'base/js/utils',
    'services/config'
], function ($, Jupyter, dialog, utils, configmod) {
    "use strict";

    //daje listę nazw notebooków z pliku notebooks.json
    function get_NotebooksList() {
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej

        $.ajaxSetup({
            async: false
        });

        var NotebooksList = [];
        //czytanie jsona
        $.getJSON("/nbextensions/source_UI/notebooks.json", function (data) {

            $.each(data['user_notebooks'], function (key, notebookName) {
                NotebooksList.push(notebookName['filename']);
            });
        });

        return NotebooksList;
    }

    // return public methods
    return {
        getNotebooksList: get_NotebooksList
    };

});