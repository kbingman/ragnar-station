var flight = require('../lib/flight');

// Flux
var Dispatcher = require('../dispatcher');
var ShipStore = require('../stores/ship_store');

// Mixins
var withAjax = require('../mixin/with_ajax.js');
var withShipXHR = require('../mixin/with_ship_xhr.js');

module.exports = flight.component(withAjax, withShipXHR, function() {

  this.newShip = function(e, data) {
    Dispatcher.find();
    this.trigger(document, 'showNewShip')
  }

  this.removeShip = function(e, data) {
    Dispatcher.delete(data);
    this.deleteShip(e, data);
    this.trigger(document, 'showNewShip');
  };

  this.updateShip = function(e, data) {
    Dispatcher.update(data);
    this.save(Dispatcher.getStore('ship').currentShip);
  };

  this.save = flight.utils.throttle(function(ship){
    if (ship.id) {
      this.putShip(null, ship).then(function(r) {
        Dispatcher.update(data.starship);
      });
    } else {
      this.createShip(null, ship).then(function(data) {
        Dispatcher.update(data.starship);
      });
    }
  }, 2000);

  this.editShip = function(e, data) {
    Dispatcher.find(data);
    this.trigger(document, 'displayShip');
  };

  this.displayShips = function(e, data) {
    Dispatcher.reset(data);
  };

  this.increaseShipAttr = function(e, data) {
    Dispatcher.increase(data.attr);
    this.save(Dispatcher.getStore('ship').currentShip);
  };

  this.decreaseShipAttr = function(e, data) {
    Dispatcher.decrease(data.attr);
    this.save(Dispatcher.getStore('ship').currentShip);
  };

  this.addWeapons = function(e, data) {
    Dispatcher.addWeapons(data);
    this.save(Dispatcher.getStore('ship').currentShip);
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

  });

});
