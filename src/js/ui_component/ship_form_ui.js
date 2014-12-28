var flight = require('../lib/flight');
// var withFormUtils = require('../mixin/with_form_utils');
var withHogan = require('../mixin/with_hogan');
var template = require('../../../templates/ships/_form.hogan');
var Dispatcher = require('../dispatcher');
var primaryWeapons = require('../utils/primary_weapons');

module.exports = flight.component(withHogan, function() {
  this.attributes({
    'inputFields': '[contenteditable]',
    'increaseButton': '[data-up]',
    'decreaseButton': '[data-down]',
    'configuration': '[name="configuration"]',
    'batteries': '#batteryWeapons',
    'addWeapons': '[data-addweapon]',
    'removeWeapons': '[data-removeweapon]',
    'armor': '[name="armor"]',
  });

  this.updateShip = function(e, data) {
    e.preventDefault();
    var attr = e.target.getAttribute('name');
    var ship = Dispatcher.getStore('ship').currentShip;

    try {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);

      this.attr.start = range.startOffset;
    } catch(e) {}


    ship[attr] = e.target.value || e.target.textContent;
    this.attr.focused = attr;
    this.trigger('updateShip', ship);
  };

  this.clearFocus = function(e) {
    this.attr.focused = undefined;
  };

  this.delegateEvents = function(e) {
    for (var key in e.target.dataset) {
      if (this[key]) {
        this[key](e, e.target.dataset[key]);
      }
    }
  };

  this.up = function(e, data) {
    e.preventDefault();
    var data = {};
    var ship = Dispatcher.getStore('ship').currentShip;
    var attr = e.target.dataset.up;
    var value = ship[attr] || 0;
    data[attr] = value + 1;

    this.trigger('updateShip', data);
  };

  this.down = function(e, data) {
    e.preventDefault();
    var data = {};
    var ship = Dispatcher.getStore('ship').currentShip;
    var attr = e.target.dataset.down;
    var value = ship[attr] || 0;
    data[attr] = value - 1 > 0 ? value - 1 : 0;

    this.trigger('updateShip', data);
  };

  this.addweapon = function(e) {
    e.preventDefault();
    var parent = e.target.parentNode;
    var id = parent.querySelector('[data-weapon]').value;
    var count = parent.querySelector('[data-count]') ? parent.querySelector('[data-count]').value : 1;

    this.trigger('addWeapons', {
      id: id,
      count: count,
      type: e.target.dataset.addweapon
    });
  };

  this.removeweapon = function(e) {
    e.preventDefault();
    var id = e.target.dataset.removeweapon;
    var type = e.target.dataset.type;

    this.trigger('removeWeapons', {
      id: id,
      type: type
    });
  };

  this.displayShip = function(e) {
    var starship = Dispatcher.getStore('ship').currentShip;

    console.log(starship)

    var context = {
      starship: starship,
      smallcraft: bootstrap.smallcraft,
      availableBatteryWeapons: bootstrap.batteryWeapons,
      availablePointDefenseWeapons: bootstrap.pointDefenseWeapons,
      availablePrimaryWeapons: bootstrap.primaryWeapons,
      configurations: bootstrap.configurations.map(function(c){
        if (c.name == starship.configuration) {
          c.selected = true;
        } else {
          c.selected = undefined;
        }
        return c;
      })
    };

    this.node.innerHTML = this.render(template, context);
    this.setFocus();
  };

  this.setFocus = function() {
    if (!this.attr.focused) {
      return;
    }

    var ship = Dispatcher.getStore('ship').currentShip;
    var node = this.node.querySelector('[name="' + this.attr.focused + '"]');
    var range = document.createRange();
    var sel = window.getSelection();
    var length = ship[this.attr.focused].length;
    var start = this.attr.start > length ? length : this.attr.start;

    range.setStart(node.firstChild, start);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  this.updateURL = function() {
    var starship = Dispatcher.getStore('ship').currentShip;
    var currentID = document.location.pathname.split('/')[2];


    if (starship.id == currentID || starship.id == undefined) {
      return;
    }
    history.pushState({ starship: starship.id }, starship.name, '/ships/' + starship.id);

  };

  this.displayNewShip = function() {
    var context = {
      starship: {
        mass: 0,
        ftl: 0,
        thrust: 0
      },
      smallcraft: bootstrap.smallcraft,
      pointDefenseWeapons: bootstrap.pointDefenseWeapons,
      primaryWeapons: bootstrap.primaryWeapons,
      configurations: bootstrap.configurations
    };

    this.node.innerHTML = this.render(template, context);
    history.pushState({ starship: 'new' }, 'new', '/ships/new');
  };

  this.after('initialize', function() {

    this.on('keyup', {
      'inputFields': flight.utils.debounce(this.updateShip, 0)
    });
    this.on('blur', {
      'inputFields': this.clearFocus
    });
    this.on('click', this.delegateEvents);
    this.on('change', {
      'configuration': this.updateShip,
      'armor': this.updateShip
    });

    this.on(document, 'showNewShip', this.displayNewShip);

    Dispatcher.on('change:all', this.updateURL.bind(this));
    Dispatcher.on('rollback:all', function() { alert('hey'); });
    Dispatcher.on('change:all', this.displayShip.bind(this));
  });
});
