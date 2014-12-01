var flight = require('../lib/flight');
var withFormUtils = require('../mixin/with_form_utils');
var template = require('../../../templates/ships/_form.hogan');
var ShipDispatcher = require('../dispatcher');

module.exports = flight.component(withFormUtils, function() {
  this.attributes({
    'createStarship': '#createStarship',
    'starshipName': '#starshipName',
    'inputFields': '[contenteditable]',
    'increaseButton': '[data-up]',
    'decreaseButton': '[data-down]'
  });

  this.updateShip = function(e, data) {
    e.preventDefault();

    var attributes = this.serialize();
    attributes.id = this.attr.id;

    this.trigger('updateShip', attributes);
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
    })
  };

  this.down = function(e, data) {
    e.preventDefault();
    var attr = e.target.dataset.down;

    this.trigger('decreaseShipAttr', {
      attr: attr
    })
  };

  this.displayShip = function(e) {
    var starship = ShipDispatcher.getStore('ship').currentShip;

    this.node.innerHTML = template.render({
      starship: starship,
      smallcraft: bootstrap.smallcraft,
      pointDefenseWeapons: bootstrap.pointDefenseWeapons,
      primaryWeapons: bootstrap.primaryWeapons,
      configurations: bootstrap.configurations.map(function(c){
        if (c.Name == starship.configuration) {
          c.Selected = true;
        } else {
          c.Selected = undefined;
        }
        return c;
      })
    });
  };

  this.updateURL = function() {
    var starship = ShipDispatcher.getStore('ship').currentShip;
    var currentID = document.location.pathname.split('/')[2];

    // temp
    this.displayShip();

    this.attr.id = starship.id;

    if (starship.id == currentID || starship.id == undefined) {
      return;
    }
    history.pushState({ starship: starship.id }, starship.name, '/ships/' + starship.id);

  };

  this.displayNewShip = function() {
    this.attr.id = undefined;
    this.node.innerHTML = template.render({
      starship: {
        mass: 0,
        ftl: 0,
        thrust: 0
      },
      smallcraft: bootstrap.smallcraft,
      pointDefenseWeapons: bootstrap.pointDefenseWeapons,
      primaryWeapons: bootstrap.primaryWeapons,
      configurations: bootstrap.configurations
    });
    history.pushState({ starship: 'new' }, 'new', '/ships/new');
  };

  this.after('initialize', function() {
    this.attr.id = document.location.pathname.split('/')[2];

    this.on('keyup', {
      'inputFields': this.updateShip
    });
    this.on('click', this.delegateEvents);
    this.on(document, 'showNewShip', this.displayNewShip);
    this.on(document, 'displayShip', this.displayShip);
    ShipDispatcher.on('change:all', this.updateURL.bind(this));
  });
});
