// file source_UI/menu.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017-2019 .....
//
//  Distributed under the terms of the BSD License.
//  To see where are all extensions loaded use:
// 'jupyter notebook list'
// look also (example dir):
// '/home/michal/.local/share/jupyter/nbextensions/'
// ---------------------------------------------------------------------------
// Adding Jupytepide into Jupyter Main menu

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
    function add_submenu(name, appendToItemName, onClickFn) {
        //new expandable menu item (submenu) in existing 'appendToItemName' dropdown main menu
        var menu_item = $('<li/>')
            .addClass('dropdown-submenu')
            .append(
                $('<a href="#">')
                    .text(name)
                    .on('click', onClickFn)
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
       return $('<li/>')
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

    //*** create_menu ***
    //Adding  positions in maimn menu, actions assignment
    function create_menu() {
        //New Menu position named "Jupytepide"
        jupytepide_menu = add_menu({name:'Jupytepide',menu_id:'jupytepide_menu'});

        //Map
        map_submenu = add_submenu('Map', '#jupytepide_menu',function(evt){
            evt.preventDefault();
            $('a[href="#1karta"]').click();
        });
        //Map-->Add GEOJSON layer
        add_menu_item('Add GEOJSON layer', 'Add new GEOJSON layer to map', '#', map_submenu, function (evt) {
            evt.preventDefault();
            $('a[href="#1karta"]').click();
            $('button[title="Add GEOJSON layer file to map"]').click();
        });
        //Map-->Remove all layers
        add_menu_item('Remove all layers', 'Remove all layers, except base ones', '#', map_submenu, function (evt) {
            evt.preventDefault();
            $('a[href="#1karta"]').click();
            $('button[title="Remove all layers"]').click();
        });

        //Snippets
        snippets_submenu = add_submenu('Snippets', '#jupytepide_menu',function(evt){
            evt.preventDefault();
            $('a[href="#2karta"]').click();
        });

        //Snippets-->Add group
        add_menu_item('Add Group', 'Add new menu group', '#', snippets_submenu, function (evt) {
            evt.preventDefault();
            code_snippets.showAddGroupWindow();
            $('a[href="#2karta"]').click();
        });

        //Notebooks
        add_menu_item('Notebooks', 'Choose notebooks', '#', jupytepide_menu, function (evt) {
            evt.preventDefault();
            $('a[href="#3karta"]').click();
        });

        //Files
        add_menu_item('Files', 'Choose files', '#', jupytepide_menu, function (evt) {
            evt.preventDefault();
            $('a[href="#4karta"]').click();
        });

        //---
        add_divider(jupytepide_menu);

        //Search EO data
        add_menu_item('Search EO data', 'Search for  Earth Observation data', '#', jupytepide_menu, function (evt) {
            evt.preventDefault();
            $('a[href="#1karta"]').click();
            $('button[title="Search for EO data"]').click();
        });

        //---
        add_divider(jupytepide_menu);

        //Panel browser
        panel_browser_submenu = add_submenu('Panel browser', '#jupytepide_menu',function(evt){
            evt.preventDefault();
        });

        //Panel browser-->Toggle
        var toggle_menu_item = add_menu_item('Toggle', 'Toggle panel browser', '#', panel_browser_submenu, function (evt) {
            evt.preventDefault();
            Jupyter.toolbar.actions.call('panel_browser:toggle-panel')
        });
        toggle_menu_item.attr('data-jupyter-action','panel_browser:toggle-panel');

        //Panel browser-->Maximize
        add_menu_item('Maximize', 'Maximize panel browser', '#', panel_browser_submenu, function (evt) {
            evt.preventDefault();
            $('button[title="expand/contract panel"]').click()
            //zrobić tu submenu i dodać: maximize i toggle
        });

        //---
        add_divider(jupytepide_menu);

        //Help
        add_menu_item('Help', 'Show help in modal', '#', jupytepide_menu, function (evt) {
            evt.preventDefault();
            showHelpDialog();
        });

        //About Jupytepide
        add_menu_item('About Jupytepide', 'About Jupytepide', '#', jupytepide_menu, function (evt) {
            evt.preventDefault();
            window.open('https://wasat.github.io/JupyTEPIDE/');
        });
    }

    //*** showHelpDialog ***
    function showHelpDialog(){
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
            keyboard_manager: Jupyter.notebook.keyboard_manager,
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
                 d.find('div.modal-content').keydown(function (event) {
                     if (event.which === keyboard.keycodes.escape) {
                         d.find('.btn-primary').first().click();
                         return false;
                     }
                 });
                d.find('.btn-primary').focus().select();
            }
        });
    }

    //*** load_ipython_extension ***
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