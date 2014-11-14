var flight = require('../lib/flight');

// Flux
var ShipDispatcher = require('../dispatcher');
var ShipStore = require('../stores/ship_store');

// Mixins
var withAjax = require('../mixin/with_ajax.js');
var withShipXHR = require('../mixin/with_ship_xhr.js');

module.exports = flight.component(withAjax, withShipXHR, function() {

  this.addShip = function(e, data) {

    // ShipDispatcher.add(data.starship);
    // need to get ship from the Store
    this.createShip(e, data);
  };

  this.clearShip = function(e, data) {
    ShipDispatcher.find({ id: 'new' });
  }

  this.needsShip = function(e, data) {
    this.getAllShips(e, data);
  };

  this.displayShip = function(e, data) {
    ShipDispatcher.reset(data);
  };

  this.removeShip = function(e, data) {
    ShipDispatcher.delete(data);
    this.deleteShip(e, data);
  };

  this.updateShip = function(e, data) {
    ShipDispatcher.update(data);
    // need to get ship from the Store
    console.log('actions#updateShip', data.id);
    this.update.call(this, e, data);
  };

  this.editShip = function(e, data) {
    ShipDispatcher.find(data);
  };

  this.update = flight.utils.throttle(function(e, data){
    this.putShip(e, data);
  }, 5000);

  this.addCreatedShip = function(e, data) {
    console.log('created', data)
    ShipDispatcher.add(data.starship);
  }

  // this.log = function(e, data) {
  //   console.log('data', data);
  // };

  this.after('initialize', function() {
    this.on(document, 'displayShipInfo', this.displayShip);

    this.on(document, 'getShips', this.needsShip);
    this.on(document, 'createShip', this.addShip);
    this.on(document, 'updateShip', this.updateShip);
    this.on(document, 'deleteShip', this.removeShip);
    this.on(document, 'editShip', this.editShip);
    this.on(document, 'newShip', this.clearShip);

    // temp
    this.on(document, 'addNewShipData', this.addCreatedShip);
    // this.on(document, 'removeShipData', this.log);
    // this.on(document, 'updateShipData', this.log);
  });

});
