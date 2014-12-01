function __keyevent(event, el, keycode) {
  var e = document.createEvent('Events');

  e.initEvent(event, true, true);
  e.keyCode = keycode;
  e.which = keycode;

  el.dispatchEvent(e);
}

module.exports = {

  keydown: function(el, keycode) {
    __keyevent('keydown', el, keycode);
  },

  keyup: function(el, keycode) {
    __keyevent('keyup', el, keycode);
  },

  keypress: function(el, keycode) {
    __keyevent('keypress', el, keycode);
  }

}
