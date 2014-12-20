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
    'primaryWeapon': '#primaryWeapon',
    'batteries': '#batteryWeapons',
    'addWeapons': '[data-add]'
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
    console.log('blur');
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
    var attr = e.target.dataset.up;

    this.trigger('increaseShipAttr', {
      attr: attr
    });
  };

  this.down = function(e, data) {
    e.preventDefault();
    var attr = e.target.dataset.down;

    this.trigger('decreaseShipAttr', {
      attr: attr
    });
  };

  this.add = function(e) {
    e.preventDefault();
    var parent = e.target.parentNode;
    var id = parent.querySelector('[data-weapon]').value;
    var count = parent.querySelector('[data-count]').value;

    this.trigger('addWeapons', {
      id: id,
      count: count,
      type: e.target.dataset.add
    });
    this.attr.focused = undefined;
  };

  // move to store, should be dynamic
  this.batteries = function(starship) {
    var factor = 1;
    var array = [];
    if (starship.mass >= 10000 && starship.mass <= 100000) {
      factor = 10;
    } else if (starship.mass > 100000) {
      factor = 100;
    }

    var limit = Math.round(starship.hardpoints.batteries / factor);

    for (var i = 0; i < limit; i++) {
      array.push((i + 1) * factor);
    }
    return array;
  };

  // move to store, should be dynamic
  this.pdt = function(starship) {
    var factor = 1;
    var array = [];
    if (starship.mass >= 1000 && starship.mass < 10000) {
      factor = 10;
    } else if (starship.mass >= 10000 && starship.mass <= 100000) {
      factor = 100;
    } else if (starship.mass > 100000) {
      factor = 1000;
    }

    var limit = Math.round(starship.hardpoints.pointDefense / factor);

    for (var i = 0; i < limit; i++) {
      array.push((i + 1) * factor);
    }
    return array;
  }

  this.displayShip = function(e) {
    var starship = Dispatcher.getStore('ship').currentShip;

    console.log(starship)

    var context = {
      starship: starship,
      smallcraft: bootstrap.smallcraft,
      availableBatteryWeapons: bootstrap.batteryWeapons,
      availablePointDefenseWeapons: bootstrap.pointDefenseWeapons,
      primaryWeapons: bootstrap.primaryWeapons,
      configurations: bootstrap.configurations.map(function(c){
        if (c.name == starship.configuration) {
          c.selected = true;
        } else {
          c.selected = undefined;
        }
        return c;
      }),
      pdt: this.pdt(starship),
      batteries: this.batteries(starship),
      armor: [1,2,3,4,5,6,7,8,9,10]
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
      'configuration': this.updateShip
    });

    this.on(document, 'showNewShip', this.displayNewShip);

    Dispatcher.on('change:all', this.updateURL.bind(this));
    Dispatcher.on('change:all', this.displayShip.bind(this));
  });
});
