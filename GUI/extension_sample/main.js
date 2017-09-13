// file moj_jupyter_extension/main.js
define([
'base/js/namespace'
], function(
Jupyter
) {
function load_ipython_extension() {
var handler = function () {
alert('To jest moj komunikat po polsku, a co!');
};
var action = {
icon: 'fa-comment-o', // a font-awesome class used on buttons, etc
help
: 'Pokaz komunikat',
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