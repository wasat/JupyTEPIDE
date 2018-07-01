// File source_UI/panel_browser.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
//Side panel for file/notebook/etc. browser displaying
//
//Przyklad zaladowania panelu bocznego
//przyklad podlinkowania stylu CSS
//przykład tworzenia linków do dokumentów Jupytera
//TODO: zrobic ladowanie danych konfiguracyjnych z uzyciem 'config'
//TODO: zrobic ladowanie stylu
//TODO: zrobic panel z filemanagerem
//TODO: spr. oprzeć panel na właściwościach jquery, może wyjść prostszy w implementacji
//TODO: zrobić z każdego elementu wizualnego (menu, panel itp.) obiekt, uprości sie kod w pliku głównym
//TODO: poprawić ładowanie do klasy list_container, tak, żeby razem był nagłówek i row_items'y. Najlepiej zbudować ten nagłówek od początku, zamiast do ładować
//<link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
//wczytanie filebrowsera Jupytera w ten sposób:
//$('#1karta').load('http://localhost:8888/tree #notebooks');
//nic nie daje, bo nie odpala się skrypt odpowiedzialny za załadowanie zawartości katalogu
//

define([
    'require',
    'jquery',
    'base/js/namespace',
    'base/js/events',
    'base/js/utils',
    'services/config',
    'tree/js/notebooklist',
    'tree/js/sessionlist',
    'contents',
    'base/js/page',
    './code_snippets',
    './jupytepide_notebooks',
    './map_browser',
    './leaflet_interface',
    './content_access'
], function (require,
             $,
             IPython, //or Jupyter
             events,
             utils,
             config,
             notebooklist,
             sesssionlist,
             contents_service,
             page,
             code_snippets,
             jupytepide_notebooks,
             map_browser,
             leaflet_interface,
             content_access) {
    'use strict';
// create config object to load parameters
    //   var base_url = utils.get_body_data('baseUrl');
    //   var config = new configmod.ConfigSection('notebook', {base_url: base_url});

//****
    var side_panel_min_rel_width = 10;
    var side_panel_max_rel_width = 90;
    var side_panel_start_width = 32;
    var map_panel = map_browser.build_map_panel();

    var build_side_panel = function (main_panel, side_panel, min_rel_width, max_rel_width) {
        if (min_rel_width === undefined) min_rel_width = 0;
        if (max_rel_width === undefined) max_rel_width = 100;

        side_panel.css('display', 'none');

        //W tym miejscu decyduje się czy panel będzie z lewej czy z prawej - jest jeszcze parę takich miejsc i należy odwrócic animację
        side_panel.insertAfter(main_panel);

        var side_panel_splitbar = $('<div class="side_panel_splitbar"/>');
        var side_panel_inner = $('<div class="side_panel_inner"/>');
        var side_panel_expand_contract = $('<i class="btn fa fa-expand hidden-print">');
        side_panel.append(side_panel_splitbar);
        side_panel.append(side_panel_inner);
        side_panel_inner.append(side_panel_expand_contract);

        side_panel_expand_contract.attr({
            title: 'expand/contract panel',
            'data-toggle': 'tooltip'
        }).tooltip({
            placement: 'right'
        }).click(function () {

            var open = $(this).hasClass('fa-expand');
            var site = $('#site');
            slide_side_panel(main_panel, side_panel,
                open ? 100 : side_panel.data('last_width') || side_panel_start_width);
            $(this).toggleClass('fa-expand', !open).toggleClass('fa-compress', open);

            var tooltip_text = (open ? 'shrink to not' : 'expand to') + ' fill the window';
            if (open) {
                side_panel.insertAfter(site);
                site.slideUp();
                $('#header').slideUp();
                side_panel_inner.css({'margin-left': 0});
                side_panel_splitbar.hide();
            }
            else {
                side_panel.insertAfter(main_panel);
                $('#header').slideDown();
                site.slideDown({
                    complete: function () {
                        events.trigger('resize-header.Page');
                    }
                });
                side_panel_inner.css({'margin-left': ''});
                side_panel_splitbar.show();
            }

            if (have_bs_tooltips) {
                side_panel_expand_contract.attr('title', tooltip_text);
                side_panel_expand_contract.tooltip('hide').tooltip('fixTitle');
            }
            else {
                side_panel_expand_contract.tooltip('option', 'content', tooltip_text);
            }
            //dla leafleta - nie działa
            Jupytepide.leafletMap.invalidateSize();
        });

        // bind events for resizing side panel
        side_panel_splitbar.mousedown(function (md_evt) {
            md_evt.preventDefault();
            $(document).mousemove(function (mm_evt) {
                mm_evt.preventDefault();
                var pix_w = side_panel.offset().left + side_panel.outerWidth() - mm_evt.pageX;
                var rel_w = 100 * (pix_w) / side_panel.parent().width();
                rel_w = rel_w > min_rel_width ? rel_w : min_rel_width;
                rel_w = rel_w < max_rel_width ? rel_w : max_rel_width;
                main_panel.css('width', (100 - rel_w) + '%');
                side_panel.css('width', rel_w + '%').data('last_width', rel_w);
            });
            return false;
        });
        $(document).mouseup(function (mu_evt) {
            $(document).unbind('mousemove');


            //   $( document ).ready(function() {
            //
            //       Jupytepide.leafletMap.invalidateSize();
            //});

            Jupytepide.leafletMap.invalidateSize(); //to resize leaflet map
        });

        return side_panel;
    };

    var slide_side_panel = function (main_panel, side_panel, desired_width) {

        var anim_opts = {
            step: function (now, tween) {
                main_panel.css('width', 100 - now + '%');
            }
        };

        if (desired_width === undefined) {
            if (side_panel.is(':hidden')) {
                desired_width = (side_panel.data('last_width') || side_panel_start_width);
            }
            else {
                desired_width = 0;
            }
        }

        var visible = desired_width > 0;
        if (visible) {
            main_panel.css({float: 'left', 'overflow-x': 'auto'});
            side_panel.show();
        }
        else {
            anim_opts['complete'] = function () {
                side_panel.hide();
                main_panel.css({float: '', 'overflow-x': '', width: ''});
            };
        }

        side_panel.animate({width: desired_width + '%'}, anim_opts).promise().then(function(){Jupytepide.leafletMap.invalidateSize();});//invalidateSize odpali po zakończeniu animacji


        return visible;
    };

    //wstawienie danych do panelu
    var populate_side_panel = function (side_panel) {
        var side_panel_inner = side_panel.find('.side_panel_inner');
        var qh = IPython.quick_help;
        var strip_modal = function (into) {
            // strip qh modal, insert content into element 'into'
            $('.quickhelp').closest('.modal-body').children().children().appendTo(into);
        };

        if ($('.quickhelp').length > 0) {
            strip_modal(side_panel_inner);
        }
        else {
            // ensure quickhelp shortcuts modal won't show
            $('body').addClass('help_panel_hide');
            // get quickhelp to show shortcuts
            qh.show_keyboard_shortcuts();
            // attach handler for qh showing shortcuts
            var qh_dia = $(qh.shortcut_dialog);
            qh_dia.on('shown.bs.modal', function (evt) {
                strip_modal(side_panel_inner);
                // delicately pretend that it was never shown, unbind handlers
                qh_dia.on('hidden.bs.modal', function () {
                    $('body').removeClass('help_panel_hide');
                    qh_dia.off('hidden.bs.modal');
                }).off('shown.bs.modal').modal("hide");
            });
        }
        // make sure content we stripped will be rebuilt
        qh.force_rebuild = true;
    };

    //tworzy dowolny link w podanym elemencie
    //zwraca obiekt skonfigurowany link <a> jako obiekt jquery
    var make_link = function (element, href_, text_) {
        var elA = $('<a/>', {href: href_}).html(text_);
        $(element).append(elA);
        $(element).append($('<br/>'));
        return elA;
    };

    //tworzy link w podanym elemencie, relatywny do katalogu roboczego
    var make_parent_link = function (element, document_, text_) {
        var parent = utils.url_path_split(Jupyter.notebook.notebook_path)[0];
        $(element).append(
            $('<a/>', {
                href: utils.url_path_join(Jupyter.notebook.base_url, 'tree', utils.encode_uri_components(parent), document_)
            }).html(text_).attr('target', '#notebook').append($('<br>')) //target niekoniecznie potrzebny....
        );
    };

    //makes only <a> element
    var make_tab_a = function (href_, text, expanded) {
        var tab_link = $('<a/>', {href: href_}).html(text);
        tab_link.attr('data-toggle', 'tab');
        tab_link.attr('aria-expanded', expanded);
        return tab_link;
    };

    var make_tab_li = function () {
        var tabsLi = $('<li/>');
        return tabsLi;
    };

    var make_tab_div = function (class_, id_) {
        var tab_div = $('<div/>', {id: id_}).addClass(class_);
        return tab_div;
    };

    function row_item(name, link, time, status, icon, on_click) {
        this.name = name;
        this.link = link;
        this.time = time;
        this.status = status;
        this.icon = icon;
        this.on_click = on_click;
    }

    var make_row_item = function (row_item) {
        var item_row = $('<div/>').addClass('list_item row');
        var colDiv = $('<div/>').addClass('col-md-12');
        var itemType = row_item.type;
        var iconName = 'file_icon';
        if (itemType==='notebook'){iconName='notebook_icon'}
         else if(itemType==='directory'){iconName='folder_icon'};

        colDiv.append(
            $('<input>',
                {
                    title: 'Click here to rename, delete, etc.',
                    type: 'checkbox'
                }));
        colDiv.append(

            $('<i/>').addClass('item_icon ' + iconName +' icon-fixed-width')
        );
        var itemName = $('<span/>').addClass('item_name').html(row_item.name);

        var a_link = $('<a/>',
            {
                href: row_item.link  //'/tree/anaconda3/bin',
            }).addClass('item_link').append(itemName).attr('onclick',row_item.onclick);//.bind('click',{},removeTabContent);

        if (row_item.on_click) {
            a_link.bind('click', {snippet_name: row_item.snippet_name},
                row_item.on_click);
        }

        colDiv.append(a_link);

        colDiv.append(
            $('<span/>', {
                title: '017-08-24 13:35'
            }).addClass('item_modified pull-right').html(row_item.time)//.click(code_snippets.insert_snippet_cell)
        );


        var DivLast = $('<div/>').addClass('item_buttons pull-right');
        var DivLast1 = $('<div/>', {style: 'visibility: hidden;'}).addClass('running-indicator').html(row_item.status);
        colDiv.append(
            $('<div/>').addClass('item_buttons pull-right'
            ).append(DivLast1)
        );

        DivLast.append();

        item_row.append(colDiv);
        return item_row;
    };

    //*** removeTabContent ***
    //Function for removing content from tabs "Notebooks" and "Files"
    function removeTabContent(options){
        //#karta - files, #3karta - notebooks
        $(options.DOMelement+' .list_item').remove();
        //alert(options.DOMelement);
    };

    function readDir(options){
        removeTabContent(options);
        loadTabContent({path:options.path,contents:options.contents,DOMelement:options.DOMelement});

    };

    //*** loadTabContent ***
    //Function for loading content into "Notebooks" and "Files" tabs
    //loadTabContent({contents:notebooks,DOMelement:'#3karta'})
    function loadTabContent(options){

        var homePath = utils.url_path_join(Jupyter.notebook.base_url, 'tree');
        var editPath = utils.url_path_join(Jupyter.notebook.base_url, 'edit');
        var viewPath = utils.url_path_join(Jupyter.notebook.base_url, 'view');
        var elementsList;
        var rowItemArray = [];
        var n;

        //removeTabContent(options.DOMelement);
        if (options.contents==="notebooks") {
            elementsList = jupytepide_notebooks.get_NotebooksListDir(options.path);
        }
        if (options.contents==="files") {
            elementsList = content_access.get_FilesListDir(options.path);
        }

        //"goto previous directory" element - first element of the list
        //prepare path to previous directory
        var path_previous=options.path;
        if (path_previous.search("/")!=-1){
            path_previous = path_previous.slice(0,path_previous.lastIndexOf("/"))
        }
        else path_previous='';

        rowItemArray[0] = {
            name: '...',
            link:'#',
            type: 'directory',
            onclick: 'Jupytepide.readDir({DOMelement:"'+options.DOMelement+'",path:"'+path_previous+'",contents:"'+options.contents+'"})'
            //onclick: 'Jupytepide.readDir({DOMelement:"'+options.DOMelement+'",path:"/",contents:"'+options.contents+'"})'
        };

        //console.log(notebooksList);
        for (i = 0; i < elementsList.length; i++) {
            var timeStr=elementsList[i].last_modified;
            timeStr=timeStr.substring(0,timeStr.search("T"));
            n = i+1;
             rowItemArray[n] = {
                 name: elementsList[i].name,
                 //link: '#',//utils.url_path_join(homePath, elementsList[i].path),
                 time: timeStr,
                 type: elementsList[i].type,
                 mimetype: elementsList[i].mimetype
                 //onclick: 'Jupytepide.readDir({DOMelement:"'+options.DOMelement+'",path:"'+elementsList[i].path+'",contents:"'+options.contents+'"})'
                 //onclick:removeTabContent,
                 //DOMelement: options.DOMelement
             };

             if (rowItemArray[n].type==='file'){

                 if (rowItemArray[n].mimetype==='text/plain'){
                     rowItemArray[n].link=utils.url_path_join(editPath, elementsList[i].path);
                 }
                 else if (rowItemArray[n].mimetype==='image/png'){
                     rowItemArray[n].link=utils.url_path_join(viewPath, elementsList[i].path);
                 }
                 else rowItemArray[n].link=utils.url_path_join(homePath, elementsList[i].path);

             }
             if (rowItemArray[n].type==='directory'){
                 rowItemArray[n].link='#';
                 rowItemArray[n].onclick='Jupytepide.readDir({DOMelement:"'+options.DOMelement+'",path:"'+elementsList[i].path+'",contents:"'+options.contents+'"})';
             }
             if (rowItemArray[n].type==='notebook'){
                rowItemArray[n].link=utils.url_path_join(homePath, elementsList[i].path);
             }

        }

        for (var i = 0; i < rowItemArray.length; i++) {
            //$('#3karta').append(make_row_item(rowItemArray[i]));

            $(options.DOMelement).append(make_row_item(rowItemArray[i]));
        }
        //$(document).ready(function() {
        //    $('.item_link').attr('onclick','Jupytepide.removeTabContent({DOMelement:"'+options.DOMelement+'"})');
        //});
    }

    // var make_snippets_menu_group = function(element){
    //
    //     var menu_snippets_item_header = $('<a/>',{href:'#',id:element.id}).addClass('menu_snippets_item_header').html(element.group_name).append($('<br>'));
    //     var menu_snippets_item_content = $('<div/>',{id:element.id}).addClass('menu_snippets_item_content');
    //     var item = {header:menu_snippets_item_header,content:menu_snippets_item_content};
    //
    //     menu_snippets_item_header.click(function(){
    //         menu_snippets_item_content.slideToggle();
    //     });
    //     menu_snippets_item_content.hide();
    //     return item;
    // };

    //simple inserting into panel
    // This method stands for panel content loading - Tabs here
    var insert_into_side_panel;
    insert_into_side_panel = function (side_panel) {
        var side_panel_inner = side_panel.find('.side_panel_inner');

        //**Tabs in bootstrap
        //tabs headers
        var tabsUl = $('<ul/>', {id: 'tabs'}).addClass('nav nav-tabs'); //mozna dodac 'nav-justified'
        var tabsLiActive = $('<li/>').addClass('active');


        tabsUl.append(tabsLiActive.append(make_tab_a('#1karta', 'Map', 'true')));
        tabsUl.append(make_tab_li().append(make_tab_a('#2karta', 'Snippets', 'false')));
        tabsUl.append(make_tab_li().append(make_tab_a('#3karta', 'Notebooks', 'false')));
        tabsUl.append(make_tab_li().append(make_tab_a('#4karta', 'Files', 'false')));
        //tabsUl.append(make_tab_li().append(make_tab_a('#4karta','karta 4','false')));

        side_panel_inner.append(tabsUl);
        // zawartość zakładek
        var tabContDiv = $('<div/>').addClass('tab-content').css({height:'85%'});
        //make_tab_div('tab-pane active', '1karta').append($('<p/>').html('Tresc zakladki 1')).appendTo(tabContDiv);
        //make_tab_div('tab-pane', '2karta').append($('<p/>').html('Tresc zakladki 2')).appendTo(tabContDiv);
        //make_tab_div('tab-pane', '3karta').append($('<p/>').html('Tresc zakladki 3')).appendTo(tabContDiv);

        make_tab_div('tab-pane active', '1karta').appendTo(tabContDiv);
        make_tab_div('tab-pane', '2karta').appendTo(tabContDiv);
        make_tab_div('tab-pane', '3karta').appendTo(tabContDiv);
        make_tab_div('tab-pane', '4karta').appendTo(tabContDiv);

        //make_tab_div('tab-pane','4karta').append($('<p/>').html('Tresc zakladki 4')).appendTo(tabContDiv);
        side_panel_inner.append(tabContDiv);

        //**koniec zakładek w bootstrap

        //** treść zakładek - przygotować w oparciu o filemanagera jupytera. Niech to będzie lista / tabelka
        //a tu własne stylowanie bootstrapa:
        //https://kursbootstrap.pl/examples/navs.html
        //https://kursbootstrap.pl/zakladki-nav-tabs/
        //$('#1karta').load("readme.md");


        //dla leafleta - odswiezanie mapy
        $('.nav-tabs a').on('shown.bs.tab', function(event){Jupytepide.leafletMap.invalidateSize()});


        var rowItemArray = [];
        var i;
//Files Tab

        loadTabContent({path:'',contents:'files',DOMelement:'#4karta'});

//Notebooks Tab

        loadTabContent({path:'notebooks',contents:'notebooks',DOMelement:'#3karta'});

//Snippets Tab

        var menu_snippets = $('<div/>').addClass('menu_snippets');

        var menu_item;
        var menu_groupsList = code_snippets.getSnippetsGroups();

        //loading snippets groups from JSON, making headers and empty content DOM elements
        //creating empty menu with groups headers
        if (menu_groupsList){
            for (i=0;i<menu_groupsList.length;i++){
             var group_name = menu_groupsList[i].group_name;
             var group_id = menu_groupsList[i].group_id;
             menu_item = code_snippets.make_snippets_menu_group({group_name:group_name,id:group_id});
             menu_snippets.append(menu_item.header).append(menu_item.content);
             menu_item={};
            };


        $('#2karta').append(menu_snippets);

        //Load snippets from JSON
        //loading menu snippets items content (snippets names) into appropriate groups
        //creating menu with groups headers and grouped items
        var snippetsList = [];
        snippetsList = code_snippets.getSnippetsList1();
        for (i = 0; i < snippetsList.length; i++) {
            //var id=snippetsList[i].group;

            code_snippets.addSnippetToUI(snippetsList[i].group,snippetsList[i].name);

        }
        }
        else {
            $('#2karta').append($('<div/>').html('Falied to load snippets. Check console log.'));
        }


//Map Tab
        //var map_panel = map_browser.build_map_panel();

        $('#1karta').append(map_panel).css({height:'100%'});

        //map_panel.show();
        //map_panel.slideToggle('medium');
        //map_panel.slideToggle('medium');
        leaflet_interface.load_map("map_container");
        leaflet_interface.load_initialBaseLayers();
        //Jupytepide.leafletMap.invalidateSize();


//kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk



    };

    var togglePanel = function () {
        var main_panel = $('#notebook_panel');
        var side_panel = $('#side_panel');


        if (side_panel.length < 1) {
            side_panel = $('<div id="side_panel"/>');
            build_side_panel(main_panel, side_panel,
                side_panel_min_rel_width, side_panel_max_rel_width);
            //populate_side_panel(side_panel);
            insert_into_side_panel(side_panel);

        }

        var visible = slide_side_panel(main_panel, side_panel);
        //side_panel.finish();
        //alert("sdfdsds");
        // Jupytepide.leafletMap.invalidateSize();

        //todo:poniższe odkomentowałem - wywalało błędy
        //if (params.help_panel_add_toolbar_button) {
        //    $('#btn_help_panel').toggleClass('active', visible);

        //};



        return visible;
    };

//***


    function load_ipython_extension() {

        //podlinkowanie stylu wlasnego panelu
        $('head').append(
            $('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: require.toUrl('./css/panel_browser.css')
            })
        );

        //bootstrap style linkage
        //  $('head').append(
        //      $('<link/>', {
        //          rel: 'stylesheet',
        //          type:'text/css',
        //          href: require.toUrl('https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css')
        //      })
        //  );


        var action = {
            icon: 'fa-film', // a font-awesome class used on buttons, etc
            help: 'Toggle side panel',
            help_index: 'to by mogla byc pomoc',
            handler: togglePanel
        };
        var prefix = 'moj_panel';
        var action_name = 'pokaz-panel';
        var full_action_name = Jupyter.actions.register(action, action_name, prefix);
        Jupyter.toolbar.add_buttons_group([full_action_name]);

        togglePanel();

        //$( document ).ready(function() {
        //leaflet_interface.map_invalidateSize();
        //Jupytepide.leafletMap.invalidateSize();
        //});

    }

    return {
        load_ipython_extension: load_ipython_extension,
        readDir:readDir
    };
});


