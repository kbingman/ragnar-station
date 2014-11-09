var flight = require('../lib/flight');

// Flux
var ShipDispatcher = require('../dispatcher');
var ShipStore = require('../stores/ship_store');

// Mixins
var withAjax = require('../mixin/with_ajax.js');
var withShipXHR = require('../mixin/with_ship_xhr.js');

module.exports = flight.component(withAjax, withShipXHR, function() {

  this.addShipData = function(e, data) {
    ShipDispatcher.add(data.starship);
    // need to get ship from the Store
    this.createShip(e, data);
  };

  this.needsShipData = function(e, data) {
    this.getAllShips(e, data);
  };

  this.displayShipInfo = function(e, data) {
    ShipDispatcher.reset(data);
  };

  this.removeShipData = function(e, data) {
    ShipDispatcher.delete(data);
    this.deleteShip(e, data);
  };

  this.updateShipData = function(e, data) {
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
    this.on(document, 'displayShipInfo', this.displayShipInfo);

    this.on(document, 'getShips', this.needsShipData);
    this.on(document, 'createShip', this.addShipData);
    this.on(document, 'updateShip', this.updateShipData);
    this.on(document, 'deleteShip', this.removeShipData);
    this.on(document, 'editShip', this.editShipData);

    // temp
    this.on(document, 'addNewShipData', this.log);
    this.on(document, 'removeShipData', this.log);
    this.on(document, 'updateShipData', this.log);
  });

});
