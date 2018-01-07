//można wykorzystać do animacji:
//https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_slide_toggle

define([
    'base/js/namespace',
    'jquery',
    'require',
    './ol',
    './code_snippets'
], function (Jupyter,
             $,
             require,
             ol,
             code_snippets) {

    function getMousePos(){
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
    };

    function load_ol_map(){

        var mapWMSTile = new ol.source.TileWMS({
            url: 'http://185.52.193.26:8080/geoserver/test/wms',
            params: {'LAYERS': 'test:centroid_point_day','TILED': true, TIME: '2017-11-30T00:00:00.000Z'},
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
                center: [1894460,6640076],
                zoom: 10
            })
        });
    };

    function load_leaflet_map(){

        var new_cell = Jupyter.notebook.insert_cell_at_index('code',1);
        $('.input').last().css({display:"none"});//.atr('style','display:none');

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
    };

    function build_map_panel (){
        //#map_panel - for map containing
        //openlayers scripts and CSS - look at css_loader.js
        //TODO: rozbudować go o panel boczny do obsługi mapy (lewa część), w prawą załadowac mapę
        var map_panel = $('<div/>',{id:'map_panel', class:'map_panel', style:'background-color:white; width:100%;position:relative;overflow:auto'});

        //html('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla ac diam. Quisque semper justo at risus. Donec venenatis, turpis vel hendrerit interdum, dui ligula ultricies purus, sed posuere libero dui id orci. Nam congue, pede vitae dapibus aliquet, elit magna vulputate arcu, vel tempus metus leo non est. Etiam sit amet lectus quis est congue mollis. Phasellus congue lacus eget neque. Phasellus ornare, ante vitae consectetuer consequat, purus sapien ultricies dolor, et mollis pede metus eget nisi. Praesent sodales velit quis augue. Cras suscipit, urna at aliquam rhoncus, urna quam viverra nisi, in interdum massa nibh nec erat.');

        return map_panel;
    };

    function load_extension(){
      load_leaflet_map();
      var map_panel = build_map_panel();

      //existing notebook UI element
      var main_panel = $('#notebook-container'); //albo wstawiać go za tym elementem, albo za site...

      //#flip_map //,style:'background-color:#1c1c1c;width:100%;height:30px;'
      var flip = $('<div/>',{id:'flip_map',class:'container toolbar'});
      flip.append($('<button/>',{id:'map_toggle', class:'btn btn-xs btn-default'}).html('Hide/Show'));
      flip.append($('<a>',{name:'map'}));


      //TODO zrobić animację - trzeba regulować height
      //TODO jeżeli ma to być pod notebook to zrobić przewijanie okna do mapy z guzika na toolbarze
      //TODO pomyśleć jeszcze jak najlepiej umieścić okno mapy

      flip.insertAfter(main_panel);
      map_panel.insertAfter(flip);
      map_panel.show();
      var visible = true;
      load_ol_map();


      //**** leaflet na próbę
     // var leaflet = $('<div/>',{class:'output_subarea jupyter-widgets-view'}).append($('<div/>',{class:'p-Widget leaflet-container leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom',style:'height:400px'}).append($('<div/>',{class:'leaflet-pane leaflet-map-pane'}).
     //  append($('<div/>',{class:'leaflet-pane leaflet-tile-pane'}).
     //   append($('<div/>',{class:'leaflet-layer ',style:'z-index: 1; opacity: 1;'}).
     //    append($('<div/>',{class:'leaflet-tile-container leaflet-zoom-animated',style:'z-index: 19; transform: translate3d(0px, 0px, 0px) scale(1);'}))))));
     // leaflet.insertAfter(map_panel);

        //map_panel.load('/nbextensions/source_UI/aa.html');
        //map_panel_load('#notebook');
        //Jupyter.notebook.execute_cell();

      $('#map_toggle').click(function(){
          map_panel.slideToggle('medium'); //albo fadeToggle(), toggle()
          //map_panel.scrollTop(200);
          //map_panel.offset({ top: 0, left: 0 });
          //alert('sdf');

          //gdy jest włączony panel boczny (to notebook panel ma scroll)
          //alert(visible);
          if (!visible){
            $('#notebook_panel').animate({
              scrollTop: $('#notebook-container').height()
            },'medium');

            //gdy jest wyłączony panel boczny (to site ma scroll)
            $('#site').animate({
                scrollTop: $('#notebook-container').height()

            },'medium');
          }

          visible=!visible;
          //alert($('#notebook-container').offset().top);
          //alert(map_panel.position().top);
      });


    };

    // return public methods
    return {
        load_ipython_extension: load_extension
    };
});