var flight = require('../lib/flight');

// Flux
var ShipDispatcher = require('../dispatcher');
var ShipStore = require('../stores/ship_store');

// Mixins
var withAjax = require('../mixin/with_ajax.js');
var withShipXHR = require('../mixin/with_ship_xhr.js');

module.exports = flight.component(withAjax, withShipXHR, function() {

  this.addShip = function(e, data) {
    console.log('add', data)
    ShipDispatcher.add(data.starship);
    // need to get ship from the Store
    this.createShip(e, data);
  };

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
    console.log(data.id);
    this.update.call(this, e, data);
  };

  this.update = flight.utils.throttle(function(e, data){
    this.updateShip(e, data);
  }, 5000);

  this.log = function(e, data) {
    console.log('data', data);
  };

  this.editShipData = function(e, data) {
    ShipDispatcher.find(data);
  };

  this.after('initialize', function() {
    this.on(document, 'displayShipInfo', this.displayShip);

    this.on(document, 'getShips', this.needsShip);
    this.on(document, 'createShip', this.addShip);
    this.on(document, 'updateShip', this.updateShip);
    this.on(document, 'deleteShip', this.removeShip);
    this.on(document, 'editShip', this.editShip);

    // temp
    this.on(document, 'addNewShipData', this.log);
    this.on(document, 'removeShipData', this.log);
    this.on(document, 'updateShipData', this.log);
  });

});
