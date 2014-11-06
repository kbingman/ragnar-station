var flight = require('../lib/flight');
var ShipDispatcher = require('../dispatcher');


module.exports = flight.component(function() {

  this.addShipData = function(e, data) {
    ShipDispatcher.add(data.starship);
  };

  this.displayShipInfo = function(e, data) {
    ShipDispatcher.reset(data);
  };

  this.removeShipData = function(e, data) {
    ShipDispatcher.delete(data.starship);
  };

  this.logger = function(e, data) {
    console.log('data', data)
  }

  this.after('initialize', function() {
    this.on(document, 'displayShipInfo', this.displayShipInfo);
    this.on(document, 'addNewShipData', this.addShipData);
    this.on(document, 'removeShipData', this.removeShipData);
    this.on(document, 'successfullyUpdatedShipData', this.logger)
  });

});
