// /** Module file jupytepide/jupytepide.js
//  * Edited by: Michał Bednarczyk
//  * Copyright (C) 2017-2019 .....
//  * Distributed under the terms of the BSD License.
//  * ---------------------------------------------------------------------------
//  * Jupytepide main object
//  * /

//Documentation generating:  jsdoc -d=doc jupytepide.js


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
    './panel_browser',
    'require'
], function ($, Jupyter, dialog, utils, configmod, leaflet_interface, code_snippets, keyboard, content_access, panel_browser,require) {
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
     * Fit the map view to given layer's extent.
     * @example
     * Jupytepide.map_fitToLayer('Roads');
     * @method map_fitToLayer
     * @param layer_name - string with layer name.
     * @memberof: class:Jupytepide
     */
    Jupytepide.map_fitToLayer = function(layer_name){
        var bounds = Jupytepide.leafletMap.layers[layer_name].getBounds();
        Jupytepide.leafletMap.fitBounds(bounds);
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
        var layer_name = 'tmpMarker';
        //Adds new "property" (object) named "name" to leafletMap object
        //this way new layer is related to leafletMap as an object
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
    //sample values
    //center=[52.407, 21.33], radius=500, popup_="Some text", parameters_={color: 'red', fillColor: '#f03', fillOpacity: 0.5}
    Jupytepide.map_addCircle = function(center,radius,popup_,parameters_){
        var layer_name = 'tmpCircle';
        //Adds new "property" (object) named "name" to leafletMap object
        //this way new layer is related to leafletMap as an object
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.add_circle(center,radius,popup_,parameters_);

    };

    /**
     * Adds a polygon into the map.
     * The layer name, into which polygon is added is set as "tmpPolygon" by default and is not shown in layers list.
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
        //Adds new "property" (object) named "name" to leafletMap object
        //this way new layer is related to leafletMap as an object
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.add_polygon(points,popup_,parameters_);

    };

    /**
     * Adds a temporary polygon from WKT into the map.
     * The layer name, into which polygon is added is set as "tmpPolygon" by default and is not shown in layers list.
     * Refer to this name when you want to delete a polygon from map.
     * @example
     * Jupytepide.map_addPolygonWKT('POLYGON((14.24 54.58,14.24 49.96,22.68 48.24,25.23 50.47,24.97 54.68,14.24 54.58))',
     *      "tekst",{color: 'red', fillColor: '#f03', fillOpacity: 0.5});
     * @param WKTPolygon - Polygon shape in WKT format.
     * @param popup_ - Content of the popup.
     * @param parameters_ - Display parameters.
     * @memberof: class:Jupytepide
     */

    Jupytepide.map_addTmpPolygonWKT = function(WKTPolygon,popup_,parameters_){
        var layer_name = 'tmpPolygon';
        if (Jupytepide.leafletMap.layers.tmpPolygon){
            Jupytepide.map_removeLayer(layer_name);
        }

        //convert WKT to array of points
        var points=[];
        var tmpPoints = WKTPolygon.slice('POLYGON'.length+2,WKTPolygon.length-2).split(',');
        tmpPoints.pop();
        var Vertex = [];
        var tmpVertex = [];
        for (var i=0;i<tmpPoints.length;i++){
            tmpVertex = tmpPoints[i].split(' ');
            for (var j=0;j<tmpVertex.length;j++){
                tmpVertex[j]=parseFloat(tmpVertex[j]);
            }
            Vertex.push(tmpVertex[1]);
            Vertex.push(tmpVertex[0]);
            points.push(Vertex);
            Vertex=[];
        }

        //Adds new "property" (object) named "name" to leafletMap object
        //this way new layer is related to leafletMap as an object
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.add_polygon(points,popup_,parameters_);

    };

    /**
     * Adds WKT polygon to the map as a search mask.
     * The layer name, into which polygon is added is set as "tmpPolygon" by default and is not shown in layers list.
     * Refer to this name when you want to delete a polygon from map.
     * @example
     * Jupytepide.addSearchPolygonWKT('POLYGON((14.24 54.58,14.24 49.96,22.68 48.24,25.23 50.47,24.97 54.68,14.24 54.58))');
     * @param WKTPolygon - Polygon shape in WKT format.
     * @memberof: class:Jupytepide
     */
    Jupytepide.addSearchPolygonWKT = function(WKTPolygon){
        var popup = 'Search temporary shape';
        var parameters = {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        };
        Jupytepide.map_addTmpPolygonWKT(WKTPolygon,popup,parameters);
        Jupytepide.leafletMap.tmpShapeWKT=WKTPolygon;
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
    //The layer's name into which polyline is added is "tmpPolyline". It is fixed and this name should be used while removing the layer.
    Jupytepide.map_addPolyline = function(latlngs,options,popup_){
        var layer_name='tmpPolyline';
        //Adds new "property" (object) named "name" to leafletMap object
        //this way new layer is related to leafletMap as an object
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

    //example:
    // url='https://demo.boundlessgeo.com/geoserver/ows?', atrib={layers:'ne:ne'}, more options: http://leafletjs.com/reference-1.3.0.html#tilelayer-wms
    Jupytepide.map_addWmsLayer = function(url_,attrib,layer_name){
        if (Jupytepide.leafletMap.layers[layer_name]) {
            alert('A layer named: "'+layer_name+'" is already loaded. Please change layer name.');
            return
        }
        //Adds new "property" (object) named "name" to leafletMap object
        //this way new layer is related to leafletMap as an object
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_wmsLayer(url_,attrib);
        //Adds tocontrol.layers (menu with checkbox)
        //remove layer click
        var removeClick = $('<a/>',{href:'#',
            id:'optLayer_'+layer_name,
            onclick:'Jupytepide.map_removeLayerDlg("'+layer_name+'")'
        }).append($('<i/>',{class:"fa fa-remove",title:'Remove layer'}));

        var displayedLayerName = layer_name+" "+removeClick[0].outerHTML;

        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],displayedLayerName);
    };

    /**
     * Adds a TMS (tiled) layer into the map.
     * @example
     * //url='/nbextensions/jupytepide/madrid/{z}/{x}/{y}.png'
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
    //example2: url='/nbextensions/jupytepide/madrid/{z}/{x}/{y}.png' - own (local) tile layer
    Jupytepide.map_addTileLayer = function(url_,attrib,layer_name){
        //Creates new PANE for the layer
        //attrib.pane = layer_name; //when this attribute is set, layer will be added to this PANE instead of default one
        //Jupytepide.leafletMap.createPane(attrib.pane);

        //Adds new "property" (object) named "name" to leafletMap object
        //this way new layer is related to leafletMap as an object
        if (Jupytepide.leafletMap.layers[layer_name]) {
            alert('A layer named: "'+layer_name+'" is already loaded. Please change layer name.');
            return
        }

        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_tileLayer(url_,attrib);

        //Adds to control.layers (menu with checkbox)
        //remove layer click
        var removeClick = $('<a/>',{href:'#',
            id:'optLayer_'+layer_name,
            onclick:'Jupytepide.map_removeLayerDlg("'+layer_name+'")'
        }).append($('<i/>',{class:"fa fa-remove",title:'Remove layer'}));

        var displayedLayerName = layer_name+" "+removeClick[0].outerHTML;
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],displayedLayerName);

        //mark element list with class name
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
        if (Jupytepide.leafletMap.layers[layer_name]) {
            alert('A layer named: "'+layer_name+'" is already loaded. Please change layer name.');
            return
        }
        //Creates new PANE for the layer - it makes that adding and deleting layer results in loading empty layer every next time (this appears with geojson only)
        //options.pane = layer_name; //when this attribute is set, layer will be added to this PANE instead of default one
        //Jupytepide.leafletMap.createPane(options.pane);
        //Adds new "property" (object) named "name" to leafletMap object
        //this way new layer is related to leafletMap as an object
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_geoJsonLayer(data,options);

        //Adds to control.layers (to menu with checkbox)
        //these are icons appearing in layers list (for every loaded layer)
        //Browse layer attributes click
        var browseClick = $('<a/>',{href:'#',
            id:'optLayer_'+layer_name,
            onclick:'Jupytepide.showLayerFeaturesData("'+layer_name+'")'
        }).append($('<i/>',{class:"fa fa-table",title:'Browse layer'}));

        //remove layer click
        var removeClick = $('<a/>',{href:'#',
            id:'optLayer_'+layer_name,
            onclick:'Jupytepide.map_removeLayerDlg("'+layer_name+'")'
        }).append($('<i/>',{class:"fa fa-remove",title:'Remove layer'}));


        //zoom (fit) to layer view click
        var fitClick = $('<a/>',{href:'#',
            id:'optLayer_'+layer_name,
            onclick:'Jupytepide.map_fitToLayer("'+layer_name+'")'
        }).append($('<i/>',{class:"fa fa-arrows-alt",title:'Fit to layer'}));

        var displayedLayerName = layer_name+" "+browseClick[0].outerHTML+removeClick[0].outerHTML+fitClick[0].outerHTML;
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],displayedLayerName);

    };
    /**
     * Used by Jupytepide to load features data (bound to GeoJSON properties) from vector layer [layer_name] into UI.
     * @example
     *
     * @param layer_name - Jupytepide layer name, which appears on the layers list after loading.
     * @memberof: class:Jupytepide
     */
    Jupytepide.showLayerFeaturesData = function(layer_name){
        var featuresData = Jupytepide.getLayerFeaturesData(layer_name);
        $('.data_browser_panel.data_layer_browser').empty();
        $('.data_browser_panel.data_layer_browser').append($('<div/>',{layerName:layer_name, style:'font-weight:bold;'}).html(layer_name)
            .append($('<a/>',{href:'#',onclick:'Jupytepide.copyLayerProductsIDsToCell("'+layer_name+'")'}).html(' Copy all')));
        var featureTable = $('<table/>',{border:"1", cellpadding:"5", style:"text-align: center;"});
        for (var i=0;i<featuresData.length;i++){
            var row=$('<tr/>');
            var col=$('<td/>').html(featuresData[i].featurePlatform);
            row.append(col);
            var col=$('<td/>').html(featuresData[i].featureProductType);
            row.append(col);
            var col=$('<td/>').html(featuresData[i].featureCompletionDate);
            row.append(col);
            col=$('<td/>').append($('<a/>',{href:'#'}).html('info').bind('click',{fID:featuresData[i].leafletID},openFeaturePopup));
            row.append(col);
            col=$('<td/>').append($('<a/>',{href:'#'}).html('copy').bind('click',{fID:featuresData[i].leafletID},Jupytepide.copyProductIDToCell));
            row.append(col);
            col=$('<td/>').append($('<a/>',{href:'https://jsoneditoronline.org/?url='+featuresData[i].featureHref,target:'about:blank'}).html('more'));
            row.append(col);

            row.bind('mouseenter',{fID:featuresData[i].leafletID},setSelectedFeatureColor);
            row.bind('mouseleave',{fID:featuresData[i].leafletID},setUnselectedFeatureColor);
            featureTable.append(row);
        }
        $('.data_browser_panel.data_layer_browser').append(featureTable);
        var check_visibility = true;
        panel_browser.data_search_toggle(check_visibility);
    };

    /**
     * */
    Jupytepide.emptyLayerBrowser = function(){
        $('.data_browser_panel.data_layer_browser').empty();
        $('.data_browser_panel.data_layer_browser').html('No layer data do display.')
    }

    /**
     * */
    Jupytepide.copyLayerProductsIDsToCell = function(layer_name){
        var featuresData = Jupytepide.getLayerFeaturesData(layer_name);
        var new_cell = Jupyter.notebook.insert_cell_above('');
        var cellStr ='';
        var newLine = '';
        for (var i=0;i<featuresData.length;i++){
            newLine = i==0 ? '' : '\n';
            cellStr = cellStr+newLine+featuresData[i].featureProductIdentifier;
        }
        new_cell.set_text(cellStr);
        new_cell.code_mirror.setOption('theme', 'mbo');
        new_cell.focus_cell();
    };

    /**
     * Adds GEOJSON layer from file *.geojson. It can be any gojsn file, simply created even in QGIS.
     * Coordinates should be in WGS4. File should be selected (checked) in Jupytepide's filebrowser.
     * @example
     *
     * @param .
     * @memberof: class:Jupytepide
     */
    Jupytepide.map_addGeoJsonFromSelectedFiles = function() {
        var i=0,count=0;
        var path_this="";
        //go through all elements on files (and folders) list
        $('div.list_item.row').each(function(){
            var checked = $($('div.list_item.row div input[type=checkbox]')[i]).is(':checked');
            if (checked){
                //var fname = $(this).text();
                var fname = $('.item_name')[i].attributes['path'].value; //read the "path" attribute value which is first in element (index 0)
                var link = $('.item_link')[i].attributes['href'].value;

                if (fname.indexOf('.geojson')!=-1){
                   console.log("fname: "+fname);
                   console.log("link: "+link);
                   var geoFile = $.getJSON(link).responseJSON;
                   Jupytepide.map_addGeoJsonLayer(geoFile,fname,{/*style:myStyle*/});
                   count++;

                   if (fname.search("/")!=-1){
                     path_this=fname.slice(0,fname.lastIndexOf("/"));
                   }
                   else path_this="";
                }
                else alert(fname+' is not a GEOJSON file');
            }
            i++
        });

        console.log(path_this);

        //Refresh tab contents
        if ($('li.active').text()=="Files"){
            panel_browser.readDir({DOMelement:"#4karta",path:path_this,contents:"files"});
        }

        if($('li.active').text()=="Notebooks"){
            panel_browser.readDir({DOMelement:"#3karta",path:path_this,contents:"notebooks"});
        }
        if(count==0){
            alert("Nothing loaded, probably no items selected.");
        }

    };

    /**
     * */
    function setSelectedFeatureColor(fID){
        Jupytepide.leafletMap._layers[fID.data.fID].setStyle({color:'red'});
        Jupytepide.leafletMap._layers[fID.data.fID].bringToFront();
    }
    /**
     * */
    function setUnselectedFeatureColor(fID){
        Jupytepide.leafletMap._layers[fID.data.fID].setStyle({color:'blue'});
    }
    /**
     * */
    function openFeaturePopup(fID){
        Jupytepide.leafletMap._layers[fID.data.fID].openPopup();
    }

    /**
     * */
    Jupytepide.copyProductIDToCell = function(fID){
        var new_cell = Jupyter.notebook.insert_cell_above('');
        var featureID;
        if (typeof fID.data == 'undefined'){
            featureID = fID
        }
        else {
            featureID = fID.data.fID;
        }
        var cellStr = Jupytepide.leafletMap._layers[featureID].feature.properties.productIdentifier;
        new_cell.set_text(cellStr);
        new_cell.code_mirror.setOption('theme', 'mbo');
        new_cell.focus_cell();

    };

    /**
     * Returns GeoJSON vector layer data (not all, but chosen). Jupytepide uses it for browsing layer data after making RESTO data search.
     * @example
     *
     * @param layer_name - Jupytepide layer name, which appears on the layers list after loading.
     * @memberof: class:Jupytepide
     */
    Jupytepide.getLayerFeaturesData = function(layer_name){
        var features = Jupytepide.leafletMap.layers[layer_name]._layers
        var featuresData = [];
        var fData = {};
        for(var property_leaflet_id in features){
            if (features.hasOwnProperty(property_leaflet_id)) {
                fData = {
                    leafletID:property_leaflet_id,
                    featureID:features[property_leaflet_id].feature.id,
                    featureHref:features[property_leaflet_id].feature.properties.links[0].href,
                    featurePlatform:features[property_leaflet_id].feature.properties.platform,
                    featureProductIdentifier:features[property_leaflet_id].feature.properties.productIdentifier,
                    featureProductType:features[property_leaflet_id].feature.properties.productType,
                    featureCompletionDate:features[property_leaflet_id].feature.properties.completionDate
                };
                featuresData.push(fData);
            }
        }
        return featuresData;
    };

    /**
     * Adds an image raster layer into the map.
     * It won't work with geotif. For geotif use "map_addTileLayer" method.
     * @example
     * //imageUrl = '/nbextensions/jupytepide/img/raster-1.jpg',
     * //imageBounds = [[51.712216, 17.22655], [51.773941, 17.12544]];
     * Jupytepide.map_addImageLayer(
     * 		'/nbextensions/jupytepide/img/raster-1.jpg',
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
        if (Jupytepide.leafletMap.layers[layer_name]) {
            alert('A layer named: "'+layer_name+'" is already loaded. Please change layer name.');
            return
        }

        //Adds new "property" (object) named "name" to leafletMap object
        //this way new layer is related to leafletMap as an object
        Jupytepide.leafletMap.layers[layer_name] = leaflet_interface.load_imageLayer(imageUrl,imageBounds,options);
        //adds into control.layers (to menu with checkbox)
        //Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],layer_name);

        //remove layer click
        var removeClick = $('<a/>',{href:'#',
            id:'optLayer_'+layer_name,
            onclick:'Jupytepide.map_removeLayerDlg("'+layer_name+'")'
        }).append($('<i/>',{class:"fa fa-remove",title:'Remove layer'}));


        //zoom (fit) to layer view click
        var fitClick = $('<a/>',{href:'#',
            id:'optLayer_'+layer_name,
            onclick:'Jupytepide.map_fitToLayer("'+layer_name+'")'
        }).append($('<i/>',{class:"fa fa-arrows-alt",title:'Fit to layer'}));

        var displayedLayerName = layer_name+" "+removeClick[0].outerHTML+fitClick[0].outerHTML;
        Jupytepide.leafletMap.control.addOverlay(Jupytepide.leafletMap.layers[layer_name],displayedLayerName);
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
        if (Jupytepide.leafletMap.layers[layer_name]) Jupytepide.leafletMap.layers[layer_name].remove();
        //remove layer from control.layers
        Jupytepide.leafletMap.control.removeLayer(Jupytepide.leafletMap.layers[layer_name]);
        //remove layer from Jupytepide
        delete Jupytepide.leafletMap.layers[layer_name];

        //remove pane created (in DOM) for that layer (if exists)
        if ($('.leaflet-'+layer_name+'-pane')) {
            $('.leaflet-'+layer_name+'-pane').remove();
        }

        if ($('.data_browser_panel.data_layer_browser [layerName]').attr('layerName')==layer_name)
        {
            Jupytepide.emptyLayerBrowser();
        }
    };

    /**
     * Remove all layers (overlays) from the map, except the initial ones (base layers)
     * @memberof: class:Jupytepide
     *
     */
    //*** map_removeAllLayers
    Jupytepide.map_removeAllLayers = function () {
        var layers = Jupytepide.leafletMap.layers;
        var names = [];
        //get all layers names
        for (var property in layers) {
            if (layers.hasOwnProperty(property)) {
                names.push(property.toString());
            }
        }
        for (var i = 0; i < names.length; i++) {
            //check if layer is not base layer
            if (names[i] !== 'mapbox' && names[i] !== 'osm') {
                Jupytepide.map_removeLayer(names[i]);
            }
        }
    };

    /**
     * Removes layer given by the "layer_name" from the map.
     * Shows confirmation dialog. This method is used by Jupytepide in UI.
     * @example
     * //To remove layer named "tmpPolyline", call:
     * Jupytepide.map_removeLayerDlg('tmpPolyline');
     * @param layer_name
     * @memberof: class:Jupytepide
     */
    Jupytepide.map_removeLayerDlg = function(layer_name){
        panel_browser.showRemoveLayerDialog(layer_name);
    };

    //*** map_layerMoveUp ***
    Jupytepide.map_layerMoveUp = function(layer_name){
        var zIndex = Jupytepide.leafletMap.layers[layer_name].options.zIndex;
        zIndex = zIndex+1;
        Jupytepide.leafletMap.layers[layer_name].setZIndex(zIndex);

        //todo: the above might not work with vector layers, then we can try grouping them and moving up/down as groups of layers
    };

    //*** map_layerMoveUp ***
    Jupytepide.map_layerMoveDown = function(layer_name){
        var zIndex = Jupytepide.leafletMap.layers[layer_name].options.zIndex;
        zIndex = zIndex-1;
        Jupytepide.leafletMap.layers[layer_name].setZIndex(zIndex);

        //todo: the above might not work with vector layers, then we can try grouping them and moving up/down as groups of layers

    };

    Jupytepide.readDir = function (options) {
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

    Jupytepide.getJupytepideHelpJSON = function() {
        var fName = require.toUrl('./help.json');
        return content_access.readJupytepideJSONFile(fName);
    };

    /**
     * Deletes selected files recursively.
     * Shows confirmation dialog. This method is used by Jupytepide in UI.
     * @example
     * ;
     * @param
     * @memberof: class:Jupytepide
     */
    Jupytepide.recursiveDeleteSelected = function(){
        content_access.recursiveDeleteSelected();
    };

    //.:*** testing area ***:.
    Jupytepide.getSnippetsList1 = function(){
        return code_snippets.getSnippetsList1();
    };

    Jupytepide.getSnippetsGroups = function(){
        return code_snippets.getSnippetsGroups();
    };

     Jupytepide.disableKeycodes = function(event){

         if (event.which === keyboard.keycodes.enter) {
             //d.find('.btn-primary').first().click();
             $('.btn-primary').click();
             return false;
         }
     };

    //methods for testing
    Jupytepide.map_LoadPolygon = function(popupText){
        leaflet_interface.load_test_polygon(popupText);
    };

    Jupytepide.getFiles = function (path, options) {
        return content_access.getFiles(path, options);
    };

    Jupytepide.getFilesList = function (path, options) {
        return content_access.getFilesList(path, options);
    };

    Jupytepide.getNotebooks = function (path) {
        return content_access.get_NotebooksListDir(path);
    };

    Jupytepide.saveFile = function(fname,data){
        content_access.saveFile(fname, data);
    };

    Jupytepide.readFile = function(fname,options){
        var a = content_access.readFile(fname, options);
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

    Jupytepide.getRestoGeoJSON = function (url_) {
        return leaflet_interface.getRestoGeoJSON(url_);
    };

    Jupytepide.getSampleUrl = function(fname) {
        return require.toUrl('./'+fname);
    };

    Jupytepide.delete = function(fname){
       return content_access.deleteFile(fname);
    };

    Jupytepide.recursiveDelete = function(fname){
        return content_access.recursiveDelete(fname);
    };

    // return public object
    return Jupytepide

});