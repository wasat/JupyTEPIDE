// file moj_jupyter_extension/main.js
// Edited by: Michał Bednarczyk
// Copyright (C) 2017 .....
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
//- Przykład załadowania guzika do paska narzędzi
//- przykład wyświetlenia komunikatu
// zmiana jeszcze
// zmiana

define([
    'base/js/namespace'
    ], function(
        Jupyter
    ) {
    function load_ipython_extension() {
        var handler = function () {
            alert('To jest moj komunikat po polsku!');
        };
        var action = {
            icon: 'fa-comment-o', // a font-awesome class used on buttons, etc
            help: 'Pokaz komunikat',
            help_index : 'to by mogla byc pomoc',
            handler : handler
        };
        var prefix = 'my_extension';
        var action_name = 'pokaz-komunikat';
        var full_action_name = Jupyter.actions.register(action, action_name, prefix); // returns 'my_
        Jupyter.toolbar.add_buttons_group([full_action_name]);
    }
    return {
        load_ipython_extension: load_ipython_extension
    };
});