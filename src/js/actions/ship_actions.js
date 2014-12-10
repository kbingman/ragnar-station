var flight = require('../lib/flight');

// Flux
var ShipDispatcher = require('../dispatcher');
var ShipStore = require('../stores/ship_store');

// Mixins
var withAjax = require('../mixin/with_ajax.js');
var withShipXHR = require('../mixin/with_ship_xhr.js');

module.exports = flight.component(withAjax, withShipXHR, function() {

  this.newShip = function(e, data) {
    this.trigger(document, 'showNewShip')
  }

  this.removeShip = function(e, data) {
    ShipDispatcher.delete(data);
    this.deleteShip(e, data);
    this.trigger(document, 'showNewShip');
  };

  this.updateShip = function(e, data) {
    ShipDispatcher.update(data);

    this.save(ShipDispatcher.getStore('ship').currentShip);
  };

  this.save = flight.utils.throttle(function(ship){
    if (ship.id) {
      this.putShip(null, ship);
    } else {
      this.createShip(null, ship);
    }
  }, 2000);

  this.editShip = function(e, data) {
    ShipDispatcher.find(data);
    this.trigger(document, 'displayShip');
  };

  this.displayShips = function(e, data) {
    ShipDispatcher.reset(data);
  };

  this.addCreatedShip = function(e, data) {
    ShipDispatcher.update(data.starship);
  };

  this.increaseShipAttr = function(e, data) {
    ShipDispatcher.increase(data.attr);
    this.save(ShipDispatcher.getStore('ship').currentShip);
  };

  this.decreaseShipAttr = function(e, data) {
    ShipDispatcher.decrease(data.attr);
    this.save(ShipDispatcher.getStore('ship').currentShip);
  };

  this.addWeapons = function(e, data) {
    ShipDispatcher.addWeapons(data);
    this.save(ShipDispatcher.getStore('ship').currentShip);
  };

  this.init = function() {
    this.getAllShips();
  }

  this.after('initialize', function() {
    this.init();
    this.on(document, 'displayShipInfo', this.displayShips);

    this.on(document, 'getShips', this.getAllShips);
    this.on(document, 'updateShip', this.updateShip);
    this.on(document, 'deleteShip', this.removeShip);
    this.on(document, 'editShip', this.editShip);
    this.on(document, 'newShip', this.newShip);
    this.on(document, 'increaseShipAttr', this.increaseShipAttr);
    this.on(document, 'decreaseShipAttr', this.decreaseShipAttr);
    this.on(document, 'addWeapons', this.addWeapons);

    // temp
    this.on(document, 'addNewShipData', this.addCreatedShip);
    // this.on(document, 'removeShipData', this.log);
    // this.on(document, 'updateShipData', this.log);
  });

});
