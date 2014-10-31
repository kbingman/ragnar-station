var flight = require('../lib/flight');

module.exports = flight.component(function() {
  this.attributes({
    'createStarship': '#createStarship',
    'starshipName': '#starshipName'
  });

  this.createShip = function(e) {
    e.preventDefault();
    var nameField = this.select('starshipName')[0];

    this.trigger('createShip', {
      name: nameField.value
    });

    nameField.value = '';
  };

  this.after('initialize', function() {
    // temp
    this.trigger(document, 'getShips');
    this.on('submit', {
      'createStarship': this.createShip
    });
  });
});
