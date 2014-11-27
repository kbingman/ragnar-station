var flight = require('../lib/flight');
var withFormUtils = require('../mixin/with_form_utils');
var template = require('../../../templates/ships/_form.hogan');
var ShipDispatcher = require('../dispatcher');

module.exports = flight.component(withFormUtils, function() {
  this.attributes({
    'createStarship': '#createStarship',
    'starshipName': '#starshipName',
    'inputFields': '[contenteditable]'
  });

  this.updateShip = function(e, data) {
    e.preventDefault();
    var currentID = document.location.pathname.split('/')[2];
    var attributes = this.serialize();

    attributes.id = this.attr.id;

    console.log(attributes);

    this.trigger('updateShip', attributes);
  };

  this.displayShip = function(e) {
    var starship = ShipDispatcher.getStore('ship').currentShip;

    this.node.innerHTML = template.render({
      starship: starship,
      smallcraft: bootstrap.smallcraft,
      pointDefenseWeapons: bootstrap.pointDefenseWeapons,
      primaryWeapons: bootstrap.primaryWeapons,
      configurations: bootstrap.configurations
    });
  };

  this.updateURL = function() {
    var starship = ShipDispatcher.getStore('ship').currentShip;
    var currentID = document.location.pathname.split('/')[2];

    this.attr.id = starship.id;

    if (starship.id == currentID || starship.id == undefined) {
      return;
    }
    history.pushState({ starship: starship.id }, starship.name, '/ships/' + starship.id);
  };

  this.displayNewShip = function() {
    this.attr.id = undefined;
    this.node.innerHTML = template.render({
      starship: {},
      smallcraft: bootstrap.smallcraft,
      pointDefenseWeapons: bootstrap.pointDefenseWeapons,
      primaryWeapons: bootstrap.primaryWeapons,
      configurations: bootstrap.configurations
    });
    history.pushState({ starship: 'new' }, 'new', '/ships/new');
  };

  this.after('initialize', function() {
    this.on('keyup', {
      'inputFields': flight.utils.debounce(this.updateShip, 10)
    });
    this.on(document, 'showNewShip', this.displayNewShip);
    this.on(document, 'displayShip', this.displayShip);
    ShipDispatcher.on('change:all', this.updateURL.bind(this));
  });
});

// Should this be in the Store, or is it part of the UI?
// this.checkAttributes = function(attributes) {
//   var errors = [];
//
//   switch (true) {
//     case attributes.name == '':
//       errors.push({ 'name': 'required' });
//     case isNaN(attributes.mass) || attributes.mass == 0:
//       errors.push({ 'mass': 'required' });
//   }
//
//   return errors;
// }

// this.showErrors = function(errors) {
//   errors.forEach(function(error) {
//     var key = Object.keys(error)[0];
//     var field = this.node.querySelector('[name="' + key + '"]');
//     var parent = field ? field.parentElement : null;
//     var messageField = parent ? parent.querySelector('.r-error-message') : null;
//
//     if (parent) {
//       parent.classList.add('r-error');
//       messageField.innerHTML = error[key];
//     }
//   }, this);
// }
