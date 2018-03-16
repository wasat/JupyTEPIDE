//można wykorzystać do animacji:
//https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_slide_toggle

define([
    'base/js/namespace',
    'jquery',
    'require',
    './ol',
    './code_snippets',
    './leaflet',
    './leaflet_interface'
], function (Jupyter,
             $,
             require,
             ol,
             code_snippets,
             leaflet,
             leaflet_interface) {

    function getMousePos() {
        //Mouse position obtaining
        var mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326',
            // comment the following two lines to have the mouse position
            // be placed within the map.
            //className: 'custom-mouse-position',
            //target: document.getElementById('mouse-position'),
            undefinedHTML: '&nbsp;'
        });
        return mousePositionControl;
    }
    //** OpenLayers map loading ***
    function load_ol_map() {

        var mapWMSTile = new ol.source.TileWMS({
            url: 'http://185.52.193.26:8080/geoserver/test/wms',
            params: {'LAYERS': 'test:centroid_point_day', 'TILED': true, TIME: '2017-11-30T00:00:00.000Z'},
            serverType: 'geoserver'
        });

        var layers = [
            new ol.layer.Tile({
                // warstwa podkladowa OSM
                source: new ol.source.OSM()
            }),
            new ol.layer.Tile({
                //extent: [-16032.384103771166,6712921.766818939,-15912.183117199644,6713077.293554317],
                //source: mapWMSTile
            })
        ];

        var map = new ol.Map({
            controls: ol.control.defaults({
                attributionOptions: {
                    collapsible: false
                }
            }).extend([getMousePos()]),
            layers: layers,
            target: 'map_panel',
            view: new ol.View({
                center: [1894460, 6640076],
                zoom: 10
            })
        });
    }
    //*** Leaflet map loading ***
    //Loading map with leaflet JS script, embeded in Jupytepide

    function load_leaflet_map(mapContainer) {
        var mymap = leaflet.map(mapContainer).setView([51.505, -0.09], 13);
        //Jupyter.mymap = mymap; //TO JEST SUPERIMPORTANT THING!!!!!!!!!!!! Stworzyć interfejs z metodami do wywołania.....mymap to obiekt główny interfejsu

        leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(mymap);

        var myIcon = leaflet.icon({
            iconUrl: '/nbextensions/source_UI/img/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -41],
            shadowUrl: '/nbextensions/source_UI/img/marker-shadow.png',
            shadowSize: [41, 41],
            shadowAnchor: [12, 41]
        });

        //leaflet.marker([51.5, -0.09],{icon: myIcon}).addTo(mymap)
        //    .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

        leaflet.marker([51.5, -0.09], {icon: myIcon}).addTo(mymap)
            .bindPopup("<b>Hello world!</b><br />I am a popup.");

        leaflet.circle([51.508, -0.11], 500, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).addTo(mymap).bindPopup("I am a circle.");

        leaflet.polygon([
            [51.509, -0.08],
            [51.503, -0.06],
            [51.51, -0.047]
        ]).addTo(mymap).bindPopup("I am a polygon.");


        var popup = leaflet.popup();

        function onMapClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(mymap);
        }

        mymap.on('click', onMapClick);

        return mymap;

        //$.getScript(require.toUrl('./' + 'leaflet_interface' + '.js'));
        //$.getScript('/nbextensions/source_UI/leaflet_interface.js');

    }
    //*** ładowanie mapy z użyciem rozszerzenia ipyleaflet ***
    //Mapa ładowana jest do nowo dodanej celki, jej kod źródłowy jest ukrywany
    function load_ipyleaflet_map() {

        var new_cell = Jupyter.notebook.insert_cell_at_index('code', 1);
        $('.input').last().css({display: "none"});//.atr('style','display:none');

        var tekst;
        tekst = code_snippets.getWebMapBrowserText();
        new_cell.set_text(tekst);

        new_cell.code_mirror.setOption('theme', 'mbo');
        var idx = [];
        idx.push(1);
        Jupyter.notebook.execute_cells(idx);

        new_cell.unselect(true);
        var first_cell = Jupyter.notebook.get_cell(0);
        first_cell.select();
    }
    function build_map_panel() {
        //#map_panel - for map containing
        //openlayers scripts and CSS - look at css_loader.js
        //TODO: rozbudować go o panel boczny do obsługi mapy (lewa część), w prawą załadowac mapę
        //var map_panel = $('<div/>',{id:'map_panel', class:'map_panel', style:'background-color:white; width:100%;position:relative;overflow:auto'});
        //cały panel
        var map_panel = $('<div/>', {
            id: 'map_panel',
            class: 'map_panel',
            style: 'background-color:white; width:100%;position:relative;'
        });

        //mapa
        var map_container = $('<div/>', {id: 'map_container', style: 'width:100%;height:400px;position:relative;'});
        //elementy leafleta - można ich nie dodawać
        //map_container.append($('<div/>',{class:'leaflet-pane leaflet-map-pane',style:'transform: translate3d(-32px, -14px, 0px);'}));
        //map_container.append($('<div/>',{class:'leaflet-control-container'}));

        //pasek narzędzowy - mój
        //TODO: umieścić go jako "wiszący" nad treścią mapy
        var control_container = $('<div/>', {class: 'map_control_container'});

        map_panel.append(map_container);
        map_panel.append(control_container);
        //html('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla ac diam. Quisque semper justo at risus. Donec venenatis, turpis vel hendrerit interdum, dui ligula ultricies purus, sed posuere libero dui id orci. Nam congue, pede vitae dapibus aliquet, elit magna vulputate arcu, vel tempus metus leo non est. Etiam sit amet lectus quis est congue mollis. Phasellus congue lacus eget neque. Phasellus ornare, ante vitae consectetuer consequat, purus sapien ultricies dolor, et mollis pede metus eget nisi. Praesent sodales velit quis augue. Cras suscipit, urna at aliquam rhoncus, urna quam viverra nisi, in interdum massa nibh nec erat.');

        return map_panel;
    }
    var leafletMap;

    function getLeafletMap() {
        return this.leafletMap;
    }
    function load_extension() {
        //load_ipyleaflet_map();
        var map_panel = build_map_panel();

        //existing notebook UI element
        //var main_panel = $('#notebook-container'); //albo wstawiać go za tym elementem, albo za site...
        var main_panel = $('#notebook_panel'); //albo wstawiać go za tym elementem, albo za site...

        //#flip_map //,style:'background-color:#1c1c1c;width:100%;height:30px;'
        var flip = $('<div/>', {id: 'flip_map', class: 'container toolbar'});
        flip.append($('<button/>', {id: 'map_toggle', class: 'btn btn-xs btn-default'}).html('Hide/Show'));
        flip.append($('<a>', {name: 'map'}));


        //TODO zrobić animację - trzeba regulować height
        //TODO jeżeli ma to być pod notebook to zrobić przewijanie okna do mapy z guzika na toolbarze
        //TODO pomyśleć jeszcze jak najlepiej umieścić okno mapy

        $('#ipython-main-app',{style:'height:94%;'});

        flip.insertAfter(main_panel);
        //wstawienie panelu z mapą
        map_panel.insertAfter(flip);
        map_panel.show();
        map_panel.slideToggle('medium');
        var visible = false;

        //load_ol_map();
        //załadowanie leafleta
        leaflet_interface.load_map("map_container");
        //warstwa inicjalizacyjna mapy
        //leaflet_interface.load_mapboxLayer();
        leaflet_interface.load_initialBaseLayers();

        $('#map_toggle').click(function () {
            map_panel.slideToggle('medium'); //albo fadeToggle(), toggle()
            //map_panel.scrollTop(200);
            //map_panel.offset({ top: 0, left: 0 });
            //alert('sdf');

            //gdy jest włączony panel boczny (to notebook panel ma scroll)
            //alert(visible);
            if (!visible) {
                $('#notebook_panel').animate({
                    scrollTop: $('#notebook-container').height()
                }, 'medium');

                //gdy jest wyłączony panel boczny (to site ma scroll)
                $('#site').animate({
                    scrollTop: $('#notebook-container').height()

                }, 'medium');
            }

            visible = !visible;
            //alert($('#notebook-container').offset().top);
            //alert(map_panel.position().top);
        });

    }
    // return public methods
    return {
        load_ipython_extension: load_extension,
        getLeafletMap: getLeafletMap

    };
});

