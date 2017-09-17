define([
    './menu',
    './toolbar_items',
    './panel_browser'
],
    function(
        menu,
        toolbar_items,
        panel_browser
    ){
    menu.load_ipython_extension();
    toolbar_items.load_ipython_extension();
    panel_browser.load_ipython_extension();

});