// /** Module file source_UI/jupytepide.js
//  * Edited by: Michał Bednarczyk
//  * Copyright (C) 2017 .....
//  * Distributed under the terms of the BSD License.
//  * ---------------------------------------------------------------------------
//  * Jupytepide main object
//  * /

//Generowanie dokumentacji:  jsdoc -d=doc jupytepide.js

//TODO: dać tu zawartość modułu jupytepide_notebooks
//TODO: pospinać jak najwięcej uniwersalnych funkcji z metodami tego obiektu

//todo:dorobić funkcję deleteAllLAyers - do usuwania wszystkich za pomocą each_Layer (leafleta) - przydatne gdy ktoś nie nada nazw tworzonym warstwom  i nie będzie mógł wywalić...
//todo:zrobić, żeby warstwy, które nie dostaną nazwy zostały ponumerowane, np.: Layer 1, itp.
//todo:nie pozwalać na wielokrotne dodawanie warstw o tej samej nazwie, bo potem nie chca się dać usunąć

/**
 * Jupytepide main object.
 * @class Jupytepide
 */
var Jupytepide = {version:'0.1.alpha'};

define([
    'jquery',
    'base/js/namespace',
    'base/js/dialog',
    'base/js/utils',
    'services/config',
    './leaflet_interface',
    './code_snippets',
    'base/js/keyboard',
    './content_access',
    './jupytepide_notebooks',
    './panel_browser'
], function ($, Jupyter, dialog, utils, configmod,leaflet_interface,code_snippets,keyboard, content_access,jupytepide_notebooks,panel_browser) {
    "use strict";

    /**
     * Sets the map view at provided center point with defined zoom.
     * @example
     * // center=[51,17], zoom=9
     * Jupytepide.map_setView([51,17],9)
     * @method map_setView
     * @param center - An array of two [lat,lon] values.
     * @param zoom - Zoom ratio integer value.
     * @memberof: class:Jupytepide
     */

    Jupytepide.map_setView = function(center,zoom){
        leaflet_interface.set_view(center,zoom);
    };

    /**
     * Adds a marker into the map.
     * @example
     * // center=[51.11134, 17.0343], popup_={title: 'Wrocław',text:'Miasto w Polsce'}
     * Jupytepide.map_addMarker([51.11134, 17.0343],{title: "Wrocław",text:"Miasto w Polsce"});
     * @param center - An array of two [lat,lon] values.
     * @param popup_ - Content of the popup.
     * @memberof: class:Jupytepide
     */

    Jupytepide.map_addMarker = function(center,popup_){
        //todo: zrobić numerowanie markerów (innych elementów też, żeby je można było usuwać
        var layer_name='tmpMarker'
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.add_marker(center,popup_);
    };

    /**
     * Adds a circle into the map.
     * The layer name, into which polylane is added is set as "tmpCircle" by default and is not shown in layers list.
     * Refer to this name when you want to delete a circle from map.
     * @example
     * //center=[52.407, 21.33], radius=500, popup_="Some text",
     * //parameters_={color: 'red', fillColor: '#f03', fillOpacity: 0.5}
     * Jupytepide.map_addCircle([52.407, 21.33],500,"Some text",
     *          {color: 'red', fillColor: '#f03', fillOpacity: 0.5});
     * @param center - An array of two [lat,lon] values.
     * @param radius - Circle radius.
     * @param popup_ - Content of the popup.
     * @param parameters_ - Display parameters.
     * @memberof: class:Jupytepide
     */
    //center=[52.407, 21.33], radius=500, popup_="Some text", parameters_={color: 'red', fillColor: '#f03', fillOpacity: 0.5}
    Jupytepide.map_addCircle = function(center,radius,popup_,parameters_){
        var layer_name = 'tmpCircle';
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.add_circle(center,radius,popup_,parameters_);

    };

    /**
     * Adds a polygon into the map.
     * The layer name, into which polylane is added is set as "tmpPolygon" by default and is not shown in layers list.
     * Refer to this name when you want to delete a polygon from map.
     * @example
     * //points=[[51.1092, 17.06108],[51.10734, 17.06698],[51.10697, 17.06587]],
     * //popup="Some text", parameters_={color: 'red',
     * //                           fillColor: '#f03', fillOpacity: 0.5}
     * Jupytepide.map_addPolygon([[51.1092, 17.06108],[51.10734, 17.06698],[51.10697, 17.06587]],
     *      "tekst",{color: 'red', fillColor: '#f03', fillOpacity: 0.5});
     * @param points - An array of vertex's [lat,lon] coordinates.
     * @param popup_ - Content of the popup.
     * @param parameters_ - Display parameters.
     * @memberof: class:Jupytepide
     */

    Jupytepide.map_addPolygon = function(points,popup_,parameters_){
        var layer_name = 'tmpPolygon';
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.add_polygon(points,popup_,parameters_);

    };

    /**
     * Adds a polyline into the map.
     * The layer name, into which polylane is added is set as "tmpPolyline" by default and is not shown in layers list.
     * Refer to this name when you want to delete a polyline from map.
     * @example
     * //latlngs=[[17.06101,51.1093],[17.06691,51.10739],[17.06581,51.10691]], options={color:'red'}, popup='linijka'
     * Jupytepide.map_addPolyline([ [17.06101,51.1093],[17.06691,51.10739],[17.06581,51.10691] ],{color:'red'},'linijka');
     * @param latlngs - An array of vertex'es [lat,lon] coordinates.
     * @param options - Display parameters.
     * @param popup_ - Content of the popup.
     * @memberof: class:Jupytepide
     */
    //nazwa warstwy, do której dodana jest polilinia to 'tmpPolyline'. Podana jest na stałe i do tej nazwy należy się odwoływac podczas usuwania
    Jupytepide.map_addPolyline = function(latlngs,options,popup_){
        var layer_name='tmpPolyline';
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.add_polyline(latlngs,options,popup_);

    };

    /**
     * Adds a WMS layer into the map.
     * @example
     * Jupytepide.map_addWmsLayer(
     *   'http://mapy.geoportal.gov.pl/wss/service/img/guest/Administracyjna/MapServer/WMSServer',
     *   {layers:'Administracyjna', opacity:1},'Administracyjna');
     * @example
     * Jupytepide.map_addWmsLayer(
     *  'http://mapy.geoportal.gov.pl/wss/service/pub/guest/kompozycjaG2_VMAPL2_WMS/MapServer/WMSServer',
     *  {layers:'Jezdnia_dr_gl_L,Jezdnia_dr_zb_L,Jezdnia_drogi_eksp_L',
     *   opacity:1, transparent:'true',format:'image/png'},'drogi');
     * @param url_ - URL of WMS service.
     * @param attrib - WMS attributes.
     * @param layer_name - Jupytepide (not WMS) layer name, which will appear on the layers list after loading.
     * @memberof: class:Jupytepide
     */

    //example: url='https://demo.boundlessgeo.com/geoserver/ows?', atrib={layers:'ne:ne'}, more options: http://leafletjs.com/reference-1.3.0.html#tilelayer-wms
    Jupytepide.map_addWmsLayer = function(url_,attrib,layer_name){
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_wmsLayer(url_,attrib);
        //dodaje do control.layers (do menu z checkboxem)
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],layer_name);
    };

    /**
     * Adds a TMS (tiled) layer into the map.
     * @example
     * //url='/nbextensions/source_UI/madrid/{z}/{x}/{y}.png'
     * Jupytepide.map_addTileLayer('http://localhost:8888/tree/aa_notebooks/madrid/{z}/{x}/{y}.png',
     *   {maxZoom:20,attribution:"",tms:true},"madrid");
     * @param url_ - URL of TMS service od catalog.
     * @param attrib - TMS attributes.
     * @param layer_name - Jupytepide (not TMS) layer name, which will appear on the layers list after loading.
     * @memberof: class:Jupytepide
     */

    //example:  url_='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    //          attrib={maxZoom:18,attribution:"",id:'mapbox.streets'},
    //          layer_name="Layer name"
    //example2: url='/nbextensions/source_UI/madrid/{z}/{x}/{y}.png' - own (local) tile layer
    Jupytepide.map_addTileLayer = function(url_,attrib,layer_name){
        // attrib == null ? {} : attrib;
        //tworzy nowy PANE dla warstwy
        //attrib.pane = layer_name; //gdy ta opcja jest ustawiona, warstwa zostanie dodana do tego pane, zamiast do domyślnego
        //Jupytepide.leafletMap.createPane(attrib.pane);
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_tileLayer(url_,attrib);
        //dodaje do control.layers (do menu z checkboxem)
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],layer_name);

        //oznacz element listy klasą
        $( document ).ready(function() {
            $('.leaflet-control-layers-overlays label div').addClass('l-layer');
        });
    };
    /**
     * Adds a GEOJSON vector layer into the map.
     * The simple example is provided here, but there are much more possibilities of usage.
     * Jupytepide leaflet-based map uses [lat,lon] while GEOJSON uses [lon,lat] coordinates.
     * More at: <a href="http://leafletjs.com/examples/geojson/">http://leafletjs.com/examples/geojson/</a>
     * The layer added with map_addGeoJsonLayer method has already binded a popup (to each feature), which
     * text is loaded from GEOJSON's feature.properties.description attribute.
     * @example
     * //first GEOJSON feature
     * var geojsonFeature ={
     * "type": "Feature",
     * "geometry": {
     * "type": "Polygon",
     * "coordinates": [[ [17.06101,51.1093],[17.06691,51.10739],[17.06581,51.10691] ]]
     * },
     * "properties": {
     * "description": "value0",
     * "prop1": {"this": "that"}
     * }
     * };
     *
     * //Then loading into map
     * Jupytepide.map_addGeoJsonLayer(geojsonFeature,"GEOJSON")
     * @example
     * //Or, when one wants to set up some display parameters
     * var myStyle = {"color": "#ff7800", "weight": 5, "opacity": 0.65};
     * Jupytepide.map_addGeoJsonLayer(geojsonFeature,"GEOJSON",{style: myStyle});
     * @param data - GEOJSON vector map data
     * @param layer_name - Jupytepide (not GEOJSON) layer name, which will appear on the layers list after loading.
     * @param options - Display options.
     * @memberof: class:Jupytepide
     */

    Jupytepide.map_addGeoJsonLayer = function(data,layer_name,options){
        options == null ? {} : options;
        //tworzy nowy PANE dla warstwy - to sprawia, że dodanie i usunięcie warstwy powoduje, że za kolejnym razem załaduje się pusta....(tylko geojson tak robi)
        //options.pane = layer_name; //gdy ta opcja jest ustawiona, warstwa zostanie dodana do tego pane, zamiast do domyślnego
        //Jupytepide.leafletMap.createPane(options.pane);
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_geoJsonLayer(data,options);

        //dodaje do control.layers (do menu z checkboxem)
        var optClick = $('<a/>',{href:'#',
            id:'optLayer_'+layer_name,
            onclick:'Jupytepide.alertTest'
        }).html('opcje'); //trzeba dać tekst - czyli outerHTML, bo leaflet control.layers obiektu nie przyjmie..

        // var optBody = $('<div/>',{id:'optBody_'+layer_name}).html('Tu będą opcje'+layer_name);

        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],layer_name+" "+optClick[0].outerHTML);
        //    $('#optLayer_'+layer_name).append(optBody);
        $( document ).ready(function() {
            if (!$('.leaflet-control-layers-overlays label').is('#lbl_' + layer_name)) {
                $('.leaflet-control-layers-overlays label').attr('id', 'lbl_' + layer_name)
            };

        });
        //TRZEBA TO OBSŁUŻYĆ POZA FUNKCJĄ DODAWANIA WARSTWY.....

        //trzeba "złapać" ten dodany <a> z identyfikatorem i odwołać się do jego "parentów", żeby nadać
        // elementowi <label> id o nazwie warstwy, wtedy będzie można przypisać onclick indywidualnie...

        //nie może tak być jak poniżej, bo on robi to na wszystkiech elementach na raz
        // $( document ).ready(function() {
        //     $('.leaflet-control-layers-overlays label div').addClass('l-layer');
        //
        //      //$('.leaflet-control-layers-overlays label').append(optBody);
        //
        //
        //     $('#optLayer').click(function(){
        //         $('#optBody').slideToggle('medium');
        //     });
        //
        //     //optBody.hide();
        //
        // });
    };
    //************************************************************

    Jupytepide.layersTest = function (){
        //var optClick = $('<a/>',{href:'#',id:'optLayer_'+layer_name}).html('opcje'); //trzeba dać tekst - czyli outerHTML, bo leaflet control.layers obiektu nie przyjmie..
        var optBody = $('<div/>',{id:'optBody'}).html('Tu będą opcje');

        //$('#optLayer_GEOJSON_MADRID1').append(optBody);
//optBody i optLayer muszą mieć suffix z nazwy warstwy, wtedy połaczę je w pary i onclick zadziała tylko na jedną na raz
// zatem do tej funkcji musi wejśc nazwa warstwy, a warstwy trzeba przejść w pętli i zaaplikować to na wszystkich.
//dodawać optBody zaraz po elemencie $('.leaflet-control-layers-overlays label #lbl_'+layer_name)
        $( document ).ready(function() {
            //$('.leaflet-control-layers-overlays label div').addClass('l-layer');

            $('#lbl_GEOJSON_MADRID1').append(optBody);


            $('#optLayer_GEOJSON_MADRID1').click(function(){
                $('#optBody').slideToggle('medium');
            });

            //optBody.hide();

        });
    };

    //To wszystko nie działa.... on sobie jakoś to odświeża i wychodzi lipa.
    //Spróbować dać taką funkcję onClick, żeby dawała wartość klikniętego elementu (niech da nazwę warstwy)

    Jupytepide.alertTest = function (){
        alert("Działa");
    };

    /**
     * Adds an image raster layer into the map.
     * It won't work with geotif. For geotif use "map_addTileLayer" method.
     * @example
     * //imageUrl = '/nbextensions/source_UI/img/raster-1.jpg',
     * //imageBounds = [[51.712216, 17.22655], [51.773941, 17.12544]];
     * Jupytepide.map_addImageLayer(
     * 		'/nbextensions/source_UI/img/raster-1.jpg',
     * 		[[51.712216, 17.22655], [51.773941, 17.12544]];
     * 		{opacity: 0.5});
     * @param imageUrl - URL of raster image.
     * @param imageBounds - Bounding coordinates of image in [lat,lon].
     * @param layer_name - Jupytepide layer name, which will appear on the layers list after loading.
     * @param options - Display options.
     * @memberof: class:Jupytepide
     */
    Jupytepide.map_addImageLayer = function(imageUrl,imageBounds,layer_name,options){
        options == null ? {} : options;
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_imageLayer(imageUrl,imageBounds,options);
        //dodaje do control.layers (do menu z checkboxem)
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],layer_name);
    };

    /**
     * Removes layer given by the "layer_name" from the map.
     * @example
     * //To remove layer named "tmpPolyline", call:
     * Jupytepide.map_removeLayer('tmpPolyline');
     * @param layer_name
     * @memberof: class:Jupytepide
     */
    //*** map_removeLayer ***
    Jupytepide.map_removeLayer = function(layer_name){
        //remove layer from leaflet component
        Jupytepide.leafletMap.layers[layer_name].remove();
        //remove layer from control.layers
        Jupytepide.leafletMap.control.removeLayer(Jupytepide.leafletMap.layers[layer_name]);
        //remove layer from Jupytepide
        delete Jupytepide.leafletMap.layers[layer_name];

        //remove pane created (in DOM) for that layer (if exists)
        if ($('.leaflet-'+layer_name+'-pane')) {
            $('.leaflet-'+layer_name+'-pane').remove();
        };

        // ale najpierw spr czy istnieje
    };

    //*** map_layerMoveUp ***
    Jupytepide.map_layerMoveUp = function(layer_name){
        var zIndex = Jupytepide.leafletMap.layers[layer_name].options.zIndex;
        zIndex = zIndex+1;
        Jupytepide.leafletMap.layers[layer_name].setZIndex(zIndex);

        //todo: to może nie działać dla warstw wektorowych, wtedy można wypróbować dodawanie warstw wektorowych do grupy i przekładanie ich wtedy jako grup

    }

    //*** map_layerMoveUp ***
    Jupytepide.map_layerMoveDown = function(layer_name){
        var zIndex = Jupytepide.leafletMap.layers[layer_name].options.zIndex;
        zIndex = zIndex-1;
        Jupytepide.leafletMap.layers[layer_name].setZIndex(zIndex);

        //todo: to może nie działać dla warstw wektorowych, wtedy można wypróbować dodawanie warstw wektorowych do grupy i przekładanie ich wtedy jako grup

    }

    Jupytepide.readDir = function(options){
        panel_browser.readDir(options);
    };

    //*** map_layerMoveDown ***

    Jupytepide.map_addLayerControls = function(baseLayers,overlays){
        Jupytepide.leafletMap.control = leaflet_interface.add_layerControls(baseLayers,overlays);
    };


    Jupytepide.map_addControlBaseLayer = function(Layer,name){
        //Jupytepide.leafletMap.control.addBaseLayer(Layer,name);
    };

    Jupytepide.map_addControlOverlayLayer = function(Layer,name){
        //Jupytepide.leafletMap.control.addOverlay(Layer,name);
    };

    Jupytepide.load_image = function(){
        leaflet_interface.load_image();
    };

    //.:*** testing area ***:.
    Jupytepide.getSnippetsList1 = function(){
        return code_snippets.getSnippetsList1();
    };

    Jupytepide.getSnippetsGroups = function(){
        return code_snippets.getSnippetsGroups();
    };

    Jupytepide.load_madrid = function(){
        var layer_name = "Madryt";
        //dodaje nową property (object) o nazwie "name" do obiektu leafletMap - w ten sposób warstwa zostaje związana z leafletMap jako obiekt
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_madrid();
        //dodaje do control.layers (do menu z checkboxem)
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],layer_name);
    };

     Jupytepide.disableKeycodes = function(event){

         if (event.which === keyboard.keycodes.enter) {
             //d.find('.btn-primary').first().click();
             $('.btn-primary').click();
             return false;
         }

     };


    //method for testing
    Jupytepide.map_LoadPolygon = function(popupText){
        leaflet_interface.load_test_polygon(popupText);
    };

    //Jupytepide.createFile = function(){
    //    code_snippets.createFile();
    //};

    Jupytepide.getFiles = function(path,options){
        return content_access.getFiles(path,options);
    };

    Jupytepide.getFilesList = function(path,options){
        return content_access.getFilesList(path,options);
    };

    Jupytepide.getNotebooks = function(path){
        return jupytepide_notebooks.get_NotebooksListDir(path);
    };

    Jupytepide.saveFile = function(fname,data){
        content_access.saveFile(fname,data);
    };

    Jupytepide.readFile = function(fname,options){
         // $.ajaxSetup({
         //     async: false
         // });
        // var val=[];
        // var promise1=code_snippets.readFile(fname,options);
        // promise1.then(function(value){val.push(value.content);},function(reject_reason){alert(reject_reason)});
        // //return promise1;
        // //var val1 = val[0];
        // return val;
        // //alert(val[0]);

        var a = content_access.readFile(fname,options);
        return a;

    };

    Jupytepide.addSnippet = function(codeSnippet){
        return code_snippets.addSnippet(codeSnippet);
    };

    Jupytepide.addGroup = function(group){
        return code_snippets.addGroup(group);
    };

    Jupytepide.snippetsUrl = function(){
        return code_snippets.getSnippetsUrl();
    };

    Jupytepide.baseUrl = function(){
        return code_snippets.getBaseUrl();
    };

    //Jupytepide.getMaxGroupId = function(){
    //    return code_snippets.getMaxGroupId();
    //};

    Jupytepide.makeMenuItem = function(){
        return code_snippets.make_snippets_menu_item({group_name:'NAZWA_GRUPY',id:12});
    };

    Jupytepide.deleteSnippet = function(codeSnippet){
        return code_snippets.deleteSnippet(codeSnippet);
    };

    Jupytepide.deleteGroup = function(group){
        return code_snippets.deleteGroup(group);
    };

    Jupytepide.addSnippetClick = function(data){
        code_snippets.addSnippetClick(data);
    };

    Jupytepide.showAddSnippetWindow = function(){
       code_snippets.showAddSnippetWindow();
     };

    Jupytepide.deleteGroupFromUI = function(gid){
        code_snippets.deleteGroupFromUI(gid);
    };

    //Jupytepide.addGroup = function(){
    //    code_snippets.showAddGroupWindow();
    //};

    // return public object
    return Jupytepide

});