var flight = require('../lib/flight');
var withFormUtils = require('../mixin/with_form_utils');
var template = require('../../../templates/ships/_form.hogan');
var ShipDispatcher = require('../dispatcher');

module.exports = flight.component(withFormUtils, function() {
  this.attributes({
    'createStarship': '#createStarship',
    'starshipName': '#starshipName',
    'inputFields': 'input'
  });

  this.createShip = function(e) {
    e.preventDefault();
    var attributes = this.getShipAttributes();
    // var errors = this.checkAttributes(attributes);

    this.trigger('createShip', attributes);

    // if (errors.length) {
    //   console.log(this.checkAttributes(attributes));
    //   this.showErrors(errors);
    // } else {
    //   this.trigger('createShip', attributes);
    // }
  };

  this.updateShip = function(e, data) {
    e.preventDefault();
    var currentID = document.location.pathname.split('/')[2];
    var attributes = this.getShipAttributes();

    // need to add a match here
    if (currentID.length == 24) {
      this.trigger('updateShip', attributes);
    } else {
      this.trigger('createShip', attributes);
    }

  };

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

  this.displayShip = function(e) {
    var starship = ShipDispatcher.getStore('ship').currentShip;
    var currentID = document.location.pathname.split('/')[2];

    // Returns if this is the currently edited starship
    if (starship.id == currentID) {
      return;
    }

    // State
    // Sets the ship to the current
    history.pushState({ starship: starship.id }, starship.name, '/ships/' + starship.id);
    if (starship.id == 'new') {
      delete starship.id;
    }
    this.attr.starshipID = starship.id;

    this.node.innerHTML = template.render({
      starship: starship,
      smallcraft: bootstrap.smallcraft,
      pointDefenseWeapons: bootstrap.pointDefenseWeapons,
      primaryWeapons: bootstrap.primaryWeapons,
      configurations: bootstrap.configurations
    });
  };

  this.getShipAttributes = function() {
    var attributes = this.serialize();
    // var currentID = document.location.pathname.split('/')[2];

    // Cast attributes into correct type
    attributes.mass = attributes.mass ? parseInt(attributes.mass) : 0;
    attributes.thrust = attributes.thrust ? parseInt(attributes.thrust) : 0;
    attributes.ftl = attributes.ftl ? parseInt(attributes.ftl) : 0;

    // Be sure there is an ID
    // if (currentID.length == 24) {
    //   this.attr.currentID = currentID;
    //   attributes.id = this.attr.currentID;
    // }

    console.log(attributes);

    return attributes;
  }

  this.after('initialize', function() {
    this.on('keyup', {
      'inputFields': flight.utils.debounce(this.updateShip, 255)
    });
    ShipDispatcher.on('change:all', this.displayShip.bind(this));
  });
});
