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
    'base/js/utils',
    './code_snippets',
    'base/js/keyboard',
    'base/js/dialog'
], function (Jupyter,
             $,
             require,
             IPython,
             utils,
             code_snippets,
             keyboard,
             dialog
) {

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
    function add_menu(options_) {
        //new item in existing menu bar
        var main_menu_item = $('<li/>')
            .addClass('dropdown')
            .append(
                $('<a href="#">')
                    .text(options_.name)
                    .addClass('dropdown-toggle')
                    .attr('data-toggle', 'dropdown')
                    .on('click', function (evt) {
                        evt.preventDefault();
                    })
            )
            .appendTo($('.navbar-nav'));
        // empty dropdown list for new main menu item
        var menu = $('<ul/>',{id:options_.menu_id})
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

    //*** add_divider ***
    function add_divider(appendToMenu){
        $('<li/>')
            .attr('class', 'divider')
            .appendTo(appendToMenu);
    };

    //***
    //tworzenie pozycji w menu głownym, przypisanie akcji

    function create_menu() {
        //elementy dodane do istniejacej pozycji w main menu - "Help"
        // moje_submenu = add_submenu('Moje menu 1', '#help_menu');
        // add_menu_item('Element 1', 'Opis elementu 1', '#', moje_submenu, function (evt) {
        //     evt.preventDefault();
        //     open_notebook('moj_probny.ipynb');
        // });
        //
        // add_menu_item('Element 2', 'Opis elementu 2', '#', moje_submenu, function (evt) {
        //     evt.preventDefault();
        // });
        //
        // add_menu_item('Element 3', 'Opis elementu 3', '#', moje_submenu, function (evt) {
        //     evt.preventDefault();
        // });
        //
        // add_menu_item('Element 4', 'Opis elementu 4', '#', moje_submenu, function (evt) {
        //     evt.preventDefault();
        // });
        //
        // add_menu_item('www.wp.pl', 'Idz do wp.pl', 'http://www.wp.pl', moje_submenu, function (evt) {
        //     //jak chcemy odpalić href, to onclick musi być pusty, jak tu;
        // });



        //Nowa pozycja na pasku Menu o nazwie "Jupytepide"
        moje_menu = add_menu({name:'Jupytepide',menu_id:'jupytepide_menu'});

        //Snippets
        snippets_submenu = add_submenu('Snippets', '#jupytepide_menu');
        add_menu_item('Add Group', 'Add new menu group', '#', snippets_submenu, function (evt) {
            evt.preventDefault();
            code_snippets.showAddGroupWindow();
        });

        //Notebooks
        add_menu_item('Notebooks', 'Choose notebooks', '#', moje_menu, function (evt) {
            evt.preventDefault();
        });

        //Map
        moje_submenu = add_submenu('Map', '#jupytepide_menu');
        //Add layer
        add_menu_item('Add layer', 'Add new layer', '#', moje_submenu, function (evt) {
            evt.preventDefault();
        });
        //Settings
        add_menu_item('Settings', 'Map settings', '#', moje_submenu, function (evt) {
            evt.preventDefault();
        });

        add_divider(moje_menu);

        //Help
        add_menu_item('Help', 'Show help in modal', '#', moje_menu, function (evt) {
            evt.preventDefault();
            showHelpDialog();
        });

        //About Jupytepide
        add_menu_item('About Jupytepide', 'About Jupytepide', '#', moje_menu, function (evt) {
            evt.preventDefault();
            window.open('https://wasat.github.io/JupyTEPIDE/');
        });
    }


    function showHelpDialog(){
        //***
        var options = {};
        var dialog_body = $('<div/>');
        var introStr = Jupytepide.getJupytepideHelpJSON().intro;
        var positionsArr = Jupytepide.getJupytepideHelpJSON().positions;

        var intro = $('<div/>',{class:'well'}).html(introStr);
        var container = $('<div/>',{class:'container-fluid'});
        var col_1 = $('<div/>',{class:'col-md-6'});
        var col_2 = $('<div/>',{class:'col-md-6'});

        var col1_length;
        var col2_length;
        var length_;
        if(positionsArr.length%2==0){
            col1_length = positionsArr.length/2;
            col2_length = col1_length;
        }
        else if(positionsArr.length%2==1){
            length_=(positionsArr.length-1)/2;
            col1_length = length_+1;
            col2_length = length_;
        }

        //first half - into first column
        for(var i=0;i<col1_length;i++){
          col_1.append($('<div/>').html(positionsArr[i].text +" ").append($('<a/>',{href:positionsArr[i].url,target:'about:blank'}).html(positionsArr[i].url)));
        }

        //second half - into second column
        for(var i=col1_length;i<positionsArr.length;i++){
            col_2.append($('<div/>').html(positionsArr[i].text +" ").append($('<a/>',{href:positionsArr[i].url,target:'about:blank'}).html(positionsArr[i].url)));
        }

        container.append(col_1).append(col_2);

        dialog_body.append(intro);
        dialog_body.append($('<div/>').append(container));


        var d = dialog.modal({
            title: "Jupytepide Help",
            body: dialog_body,
            notebook: options.notebook,
            keyboard_manager: Jupyter.notebook.keyboard_manager,//jeżeli to jest nieprzypisane to nie da się nic wprowadzić z klawiatury
            default_button: "Close",
            buttons : {
                "Close": {
                    class:'btn-primary',
                    click: function(){
                        d.modal('hide');

                          }
                }
            },
            open : function () {
                d.find('.modal-body').attr('style','max-height: calc(100vh - 200px);overflow:auto;color:white;');
                d.find('div.modal-content').attr('tabindex','0');
                /**
                 * Upon ENTER, click the OK button.
                 */
                //Jeżeli nie podany jest keyboard_manager powyżej, to trzeba każde pole edycyjne potraktować tak:
                //Jupyter.notebook.keyboard_manager.register_events(d.find('input[type="text"]'));

                 d.find('div.modal-content').keydown(function (event) {
                     if (event.which === keyboard.keycodes.escape) {
                         d.find('.btn-primary').first().click();
                         return false;
                     }
                 });
                d.find('.btn-primary').focus().select();
            }
        });
        //***
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