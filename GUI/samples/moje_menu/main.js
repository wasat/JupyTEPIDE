// file moje_menu/main.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
//
// - Przykład tworzenia menu głównego
// - Przyklad otwierania pliku
// TODO: Udoskonalic funkcje ladujaca menu, tak, zeby mozna bylo zdefiniowac elementy menu w tablicy tekstowej i podac jako argument wejsciowy

define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/namespace',
    'base/js/utils'
], function(
    Jupyter,
    $,
    require,
    IPython,
    utils
) {

    //otwieranie notebooka, lub innego pliku - jako name można podać dowolny plik
    function open_notebook(name){
        var parent = utils.url_path_split(Jupyter.notebook.notebook_path)[0];
        window.open(
            //"http://localhost:8888/notebooks/anaconda3/moj_probny.ipynb"
            utils.url_path_join(
                Jupyter.notebook.base_url, 'tree',
                utils.encode_uri_components(parent), name)
            , IPython._target);
    }

    //tworzenie pozycji w menu głownym, przypisanie akcji
    function create_menu () {


        //elementy dodane do istniejacej pozycji "Help"
        var moje_menu_item = $('<li/>')
            .addClass('dropdown-submenu')
            .append(
                $('<a href="#">')
                    .text('Moje menu')
                    .on('click', function (evt) { evt.preventDefault(); })
            )
            .appendTo($('#help_menu')); //id elementu w istniejacym menu glownym

        var moje_submenu = $('<ul/>')
            .addClass('dropdown-menu')
            .appendTo(moje_menu_item);

        $('<li/>')
            .attr('title', 'Opis elementu 1')
            .append(
                $('<a href="#">')
                    .text('Element 1')
                    .on('click', function (evt) {
                        evt.preventDefault(); //to jest animacja samego menu
                        //W tym miejscu umieszczamy wywołanie funkcji robiacej cos w Jupyterze notebook;
                        //open_notebook('moj_probny.ipynb');
                    })
            )
            .appendTo(moje_submenu);

        $('<li/>')
            .attr('title', 'Opis elementu 2')
            .append(
                $('<a href="#">')
                    .text('Element 2')
                    .on('click', function (evt) {
                        evt.preventDefault();
                        //W tym miejscu umieszczamy wywołanie funkcji robiacej cos w Jupyterze notebook;
                    })
            )
            .appendTo(moje_submenu);

        $('<li/>')
            .attr('title', 'Opis elementu 3')
            .append(
                $('<a href="#">')
                    .text('Element 3')
                    .on('click', function (evt) {
                        evt.preventDefault();
                        //W tym miejscu umieszczamy wywołanie funkcji robiacej cos w Jupyterze notebook;
                    })
            )
            .appendTo(moje_submenu);

        $('<li/>')
            .attr('title', 'Opis elementu 4')
            .append(
                $('<a href="#">')
                    .text('Element 4')
                    .on('click', function (evt) {
                        evt.preventDefault();
                        //W tym miejscu umieszczamy wywołanie funkcji robiacej cos w Jupyterze notebook;
                    })
            )
            .appendTo(moje_submenu);

        $('<li/>')
            .attr('title', 'Idz do wp.pl')
            .append(
                $('<a href="http://www.wp.pl">')
                    .text('www.wp.pl')
                    .on('click', function (evt) {
                        //evt.preventDefault();
                        //W tym miejscu umieszczamy wywołanie funkcji robiacej cos w Jupyterze notebook;
                    })
            )
            .appendTo(moje_submenu);

        //Nowa pozycja na pasku Menu o nazwie "Nowe menu"
        var nowe_menu_item = $('<li/>')
            .addClass('dropdown')
            .append(
                $('<a href="#">')
                    .text('Nowe menu')
                    .addClass('dropdown-toggle')
                    .attr('data-toggle','dropdown')
                    .on('click', function (evt) { evt.preventDefault(); })
            )
            .appendTo($('.navbar-nav'));

        var moje_menu_item1 = $('<ul/>')
            .addClass('dropdown-menu')

            .appendTo($(nowe_menu_item)); //id elementu w istniejacym menu glownym

        $('<li/>')
            .attr('title','opis opis')
            .append(
                $('<a href="#">')
                    .text('Moj probny notebook')
                    .on('click', function (evt) {
                        evt.preventDefault();
                        open_notebook('moj_probny.ipynb');
                    })
            )
            .appendTo(moje_menu_item1);

        $('<li/>')
            .attr('title','opis opis')
            .append(
                $('<a href="#">')
                    .text('Element 2')
                    .on('click', function (evt) { evt.preventDefault(); })
            )
            .appendTo(moje_menu_item1);

    }

    function load_ipython_extension() {
        // try to load jquery-ui
        if ($.ui === undefined && options.highlight.use) {
            require(['jquery-ui'], function ($) {}, function (err) {
                // try to load using the older, non-standard name (without hyphen)
                require(['jqueryui'], function ($) {}, function (err) {
                    console.log(log_prefix, 'couldn\'t find jquery-ui, so no animations');
                });
            });
        }

        create_menu();

      }
    return {
        load_ipython_extension: load_ipython_extension
    };
});