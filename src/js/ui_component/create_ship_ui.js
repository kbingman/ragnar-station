var flight = require('../lib/flight');
var withFormUtils = require('../mixin/with_form_utils');

module.exports = flight.component(withFormUtils, function() {
  this.attributes({
    'createStarship': '#createStarship',
    'starshipName': '#starshipName',
    'inputFields': 'input'
  });

  this.createShip = function(e) {
    e.preventDefault();
    var attributes = this.getShipAttributes();
    var errors = this.checkAttributes(attributes);

    if (errors.length) {
      console.log(this.checkAttributes(attributes));
      this.showErrors(errors);
    } else {
      this.trigger('createShip', attributes);
      this.clearFields();
    }
  };

  this.updateShip = function(e, data) {
    e.preventDefault();
    var attributes = this.getShipAttributes();
    if (this.attr.id == 'new') {
      this.trigger('createShip', attributes);
    } else {
      this.trigger('updateShip', attributes);
    }

  };

  // Should this be in the Store, or is it part of the UI?
  this.checkAttributes = function(attributes) {
    var errors = [];

    switch (true) {
      case attributes.name == '':
        errors.push({ 'name': 'required' });
      case isNaN(attributes.mass) || attributes.mass == 0:
        errors.push({ 'mass': 'required' });
    }

    return errors;
  }

  this.showErrors = function(errors) {
    errors.forEach(function(error) {
      var key = Object.keys(error)[0];
      var field = this.node.querySelector('[name="' + key + '"]');
      var parent = field ? field.parentElement : null;
      var messageField = parent ? parent.querySelector('.r-error-message') : null;

      if (parent) {
        parent.classList.add('r-error');
        messageField.innerHTML = error[key];
      }
    }, this);
  }

  this.getShipAttributes = function() {
    var attributes = this.serialize();

    // Cast attributes into correct type
    attributes.mass = attributes.mass ? parseInt(attributes.mass) : 0;
    attributes.thrust = attributes.thrust ? parseInt(attributes.thrust) : 0;
    attributes.ftl = attributes.ftl ? parseInt(attributes.ftl) : 0;

    // Be sure there is an ID TEMP!
    if (this.attr.id != 'new') {
      attributes.id = this.attr.id;
    }

    debugger

    return attributes;
  }

  this.after('initialize', function() {
    this.attr.id = document.location.pathname.split('/')[2];
    this.on('keyup', {
      'inputFields': flight.utils.debounce(this.updateShip, 700)
    });
  });
});
