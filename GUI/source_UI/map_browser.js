//można wykorzystać do animacji:
//https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_slide_toggle

define([
    'base/js/namespace',
    'jquery',
    'require',
    './ol'
], function (Jupyter,
             $,
             require,
             ol) {

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
            layers: layers,
            target: 'map_panel',
            view: new ol.View({
                center: [1894460,6640076],
                zoom: 10
            })
        });
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
      var map_panel = build_map_panel();

      //existing notebook UI element
      var main_panel = $('#notebook-container'); //albo wstawiać go za tym elementem, albo za site...

      //#flip_map
      var flip = $('<div/>',{id:'flip_map',style:'background-color:#1c1c1c;width:100%;'});
      flip.append($('<button/>',{id:'map_toggle'}).html('Hide/Show'));
      flip.append($('<a>',{name:'map'}));


      //TODO zrobić animację - trzeba regulować height
      //TODO jeżeli ma to być pod notebook to zrobić przewijanie okna do mapy z guzika na toolbarze
      //TODO pomyśleć jeszcze jak najlepiej umieścić okno mapy

      flip.insertAfter(main_panel);
      map_panel.insertAfter(flip);
      map_panel.show();
      var visible = true;
      load_ol_map();


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