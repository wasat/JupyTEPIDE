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
], function (Jupyter,
             $,
             require,
             IPython,
             utils) {

    //otwieranie notebooka, lub innego pliku - jako name można podać dowolny plik
    function open_notebook(name) {
        var parent = utils.url_path_split(Jupyter.notebook.notebook_path)[0];
        window.open(
            //"http://localhost:8888/notebooks/anaconda3/moj_probny.ipynb"
            utils.url_path_join(
                Jupyter.notebook.base_url, 'tree',
                utils.encode_uri_components(parent), name)
            , IPython._target);
    }


//albo zrobić sobie menu item definiowany w ten sposób jako obiekt - może on być parametrem wejściowym dla funkcji tworzącej menu:
    function menu_item(klasa, href, text) {
        this.CSSclass = klasa;
        this.itemHref = href;
        this.itemText = text;
    }

    //*** add_menu ***
    // Adds new position in main menu. Creates empty dropdown list for it.
    //In:
    // name:string - main menu item name
    //Out:
    //Jquery DOM object to which the menu items will be added
    function add_menu(name) {
        //new item in existing menu bar
        var main_menu_item = $('<li/>')
            .addClass('dropdown')
            .append(
                $('<a href="#">')
                    .text(name)
                    .addClass('dropdown-toggle')
                    .attr('data-toggle', 'dropdown')
                    .on('click', function (evt) {
                        evt.preventDefault();
                    })
            )
            .appendTo($('.navbar-nav'));
        // empty dropdown list for new main menu item
        var menu = $('<ul/>')
            .addClass('dropdown-menu')
            .appendTo($(main_menu_item)); //id elementu w istniejacym menu glownym

        return menu;
    }


    //*** add_submenu ***
    // Creates and adds a submenu item in existing menu.
    //In:
    //name:string - name of submenu (item) to be displayed in existing menu dropdown
    //appendToItemName:string - jquery CSS identifier of DOM object representing the main menu item
    //                           into which the submenu is added.
    //Out:
    //Jquery DOM object to which the menu items will be added
    function add_submenu(name, appendToItemName) {
        //new expandable menu item (submenu) in existing 'appendToItemName' dropdown main menu
        var menu_item = $('<li/>')
            .addClass('dropdown-submenu')
            .append(
                $('<a href="#">')
                    .text(name)
                    .on('click', function (evt) {
                        evt.preventDefault();
                    })
            )
            .appendTo($(appendToItemName));
        //empty dropdown list for new submenu
        var submenu = $('<ul/>')
            .addClass('dropdown-menu')
            .appendTo(menu_item);

        return submenu;
    }

    //*** add_menu_item ***
    //Adds a menu item into menu or submenu dropdown list
    //In:
    // name:string - item name
    // desc:string - item description (hint) shown on mouseover
    // href_:string - URL string. When empty, use:"#"
    // appendToMenu: Jquery DOM object representing menu or submenu dropdown list, into which the menu item is added
    function add_menu_item(name, desc, href_, appendToMenu, onClickFn) {
        $('<li/>')
            .attr('title', desc)
            .append(
                $('<a href=' + href_ + '>')
                    .text(name)
                    .on('click', onClickFn)
            )
            .appendTo(appendToMenu);
    }

    //***
    //tworzenie pozycji w menu głownym, przypisanie akcji

    function create_menu() {
        //elementy dodane do istniejacej pozycji w main menu - "Help"
        moje_submenu = add_submenu('Moje menu 1', '#help_menu')
        add_menu_item('Element 1', 'Opis elementu 1', '#', moje_submenu, function (evt) {
            evt.preventDefault();
            open_notebook('moj_probny.ipynb');
        });

        add_menu_item('Element 2', 'Opis elementu 2', '#', moje_submenu, function (evt) {
            evt.preventDefault();
        });

        add_menu_item('Element 3', 'Opis elementu 3', '#', moje_submenu, function (evt) {
            evt.preventDefault();
        });

        add_menu_item('Element 4', 'Opis elementu 4', '#', moje_submenu, function (evt) {
            evt.preventDefault();
        });

        add_menu_item('www.wp.pl', 'Idz do wp.pl', 'http://www.wp.pl', moje_submenu, function (evt) {
            //jak chcemy odpalić href, to onclick musi być pusty, jak tu;
        });

        //Nowa pozycja na pasku Menu o nazwie "Nowe menu"
        moje_menu = add_menu('Nowe menu');

        add_menu_item('Otworz probny notebook', 'Otworz probny notebook', '#', moje_menu, function (evt) {
            evt.preventDefault();
            open_notebook('moj_probny.ipynb');
        });

        add_menu_item('Element 1', 'Opis elementu 1', '#', moje_menu, function (evt) {
            evt.preventDefault();
        });

    }

    function load_ipython_extension() {
        // try to load jquery-ui
        if ($.ui === undefined && options.highlight.use) {
            require(['jquery-ui'], function ($) {
            }, function (err) {
                // try to load using the older, non-standard name (without hyphen)
                require(['jqueryui'], function ($) {
                }, function (err) {
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