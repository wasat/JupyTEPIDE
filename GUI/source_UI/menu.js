// file source_UI/menu.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
//  To see where are all extensions loaded use:
// 'jupyter notebook list'
// look also (example dir):
// '/home/michal/.local/share/jupyter/nbextensions/'
// ---------------------------------------------------------------------------

// Main menu positions adding
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

    //tymczasowo, do testowania
    function onClickEmpty() {
        //evt.preventDefault(); //to jest animacja samego menu
        //W tym miejscu umieszczamy wywołanie funkcji robiacej cos w Jupyterze notebook;
        //open_notebook('moj_probny.ipynb');
    }

//albo zrobić sobie menu item definiowany w ten sposób jako obiekt - może on być parametrem wejściowym dla funkcji tworzącej menu:
    function menu_item(klasa,href,text){
        this.CSSclass=klasa;
        this.itemHref=href;
        this.itemText=text;
    }

    //***
    function add_submenu(name,appendToItemName){
        var menu_item = $('<li/>')
            .addClass('dropdown-submenu')
            .append(
                $('<a href="#">')
                    .text(name)
                    .on('click', function (evt) { evt.preventDefault(); })
            )
            .appendTo($(appendToItemName));

        var submenu = $('<ul/>')
            .addClass('dropdown-menu')
            .appendTo(menu_item);

        return submenu;
    }

    function add_menu_item(name,desc,href_,appendToMenu,onClickFn){
        $('<li/>')
            .attr('title', desc)
            .append(
                $('<a href='+href_+'>')
                    .text(name)
                    .on('click', onClickFn)
            )
            .appendTo(appendToMenu);
    }

    //***
//CZY MOŻNA PRZEKAZAĆ DOWOLNĄ FUNKCJĘ JAKO PARAMETR?
    //tworzenie pozycji w menu głownym, przypisanie akcji

    function create_menu () {
        //elementy dodane do istniejacej pozycji "Help"
        moje_submenu = add_submenu('Moje menu 1','#help_menu')
        add_menu_item('Element 1','Opis elementu 1','#',moje_submenu,function (evt){
            evt.preventDefault();
            open_notebook('moj_probny.ipynb');
        });

        add_menu_item('Element 2','Opis elementu 2','#',moje_submenu,function (evt){
            evt.preventDefault();
        });

        add_menu_item('Element 3','Opis elementu 3','#',moje_submenu,function (evt){
            evt.preventDefault();
        });

        add_menu_item('Element 4','Opis elementu 4','#',moje_submenu,function (evt){
            evt.preventDefault();
        });

        add_menu_item('www.wp.pl','Idz do wp.pl','http://www.wp.pl',moje_submenu,function (evt){
            //jak chcemy odpalić href, to onclick musi być pusty, jak tu;
        });

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