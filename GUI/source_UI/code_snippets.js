// Code cell snippets

define([
    'jquery',
    'base/js/namespace',
    'base/js/dialog',
    'base/js/utils',
    'services/config'
], function ($, Jupyter, dialog, utils, configmod) {
    "use strict";

    // create config object to load parameters
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    config.loaded.then(function () {
        var dropdown = $("<select></select>").attr("id", "snippet_picker")
            .css("margin-left", "0.75em")
            .attr("class", "form-control select-xs")
            .change(insert_cell);
        Jupyter.toolbar.element.append(dropdown);
    });

    // will be called when the nbextension is loaded
    function load_extension() {
        config.load(); // trigger loading config parameters

        $.getJSON("/nbextensions/source_UI/code_snippets.json", function (data) {
            // Add the header as the top option, does nothing on click
            var option = $("<option></option>")
                .attr("id", "snippet_header")
                .text("Snippets");
            $("select#snippet_picker").append(option);

            // Add options for each code snippet in the snippets.json file
            $.each(data['code_snippets'], function (key, snippet) {
                var option = $("<option></option>")
                    .attr("value", snippet['name'])
                    .text(snippet['name'])
                    .attr("code", snippet['code'].join('\n'));
                $("select#snippet_picker").append(option);
            });
        })
            .error(function (jqXHR, textStatus, errorThrown) {
                // Add an error message if the JSON fails to load
                var option = $("<option></option>")
                    .attr("value", 'ERROR')
                    .text('Error: failed to load snippets!')
                    .attr("code", "");
                $("select#snippet_picker").append(option);
            });

    }


    function insert_cell() {
        var selected_snippet = $("select#snippet_picker").find(":selected");

        if (selected_snippet.attr("name") != 'header') {
            var code = selected_snippet.attr("code");
            var new_cell = Jupyter.notebook.insert_cell_above('code');
            new_cell.set_text(code);
            new_cell.focus_cell();

            $("option#snippet_header").prop("selected", true);
        }
    };

    //czytanie z pliku JSON po podanej nazwie snippeta
    function insert_cell1(name){
        //handle function passed IN parameter
        var snippet_name = name.data.snippet_name;

        //czytanie jsona
        $.getJSON("/nbextensions/source_UI/code_snippets.json", function (data) {
            // Insert snippet from JSON file named "snippet_name"
            $.each(data['code_snippets'], function (key, snippet) {
                if (snippet['name']==snippet_name){
                    var new_cell = Jupyter.notebook.insert_cell_above('');
                    new_cell.set_text(snippet['code'].join('\n'));
                    new_cell.focus_cell();
                };

            });
        })


    };

    //daje listę nazw snippetów z pliku JSON
    function get_SnippetsList(){
        //to wyłącza działanie asynchroniczne funkcji $getJSON i mozna wtedy poza nią przekazać wartość zmiennej
        // (w tym przypadku tablicy snippetNames)
        $.ajaxSetup({
            async: false
        });

        var snippetsNames = [];
        //czytanie jsona
        $.getJSON("/nbextensions/source_UI/code_snippets.json", function (data) {
            // Insert snippet from JSON file named "snippet_name"
            $.each(data['code_snippets'], function (key, snippet) {
                snippetsNames.push(snippet['name']);
                //snippetsNames.push([{name:'Example 1',link:'#',time:'yesterday',snippet_name:'Example1',on_click:insert_cell1}]);

            });
        });

        return snippetsNames;
    };

    // return public methods
    return {
        load_ipython_extension: load_extension,
        insert_snippet_cell:insert_cell1,
        getSnippetsList:get_SnippetsList
    };
});
