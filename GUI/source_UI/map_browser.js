//można wykorzystać do animacji:
//https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_slide_toggle

define([
    'base/js/namespace',
    'jquery',
    'require'
], function (Jupyter,
             $,
             require) {

    function load_extension(){
      var map_panel = $('<div/>',{id:'map_panel', style:'width:20%'}).html('czarna krowa w kropki bordo jadła sobie trawę');
      $('#ipython-main-app').append(map_panel);
    };

    // return public methods
    return {
        load_ipython_extension: load_extension
    };
});