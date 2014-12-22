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
    this.deleteShip(e, data).then(function() {
      Dispatcher.delete(data);
    });
    this.trigger(document, 'showNewShip');
  };

  this.updateShip = function(e, data) {
    Dispatcher.dispatch('update', data).then(_saveValidShip.bind(this));

    function _saveValidShip() {
      var ship = Dispatcher.getStore('ship').currentShip;
      this.save(ship);
    }
  };

  this.save = flight.utils.throttle(function(ship){
    if (!ship.isValid) {
      return;
    }
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

  this.addWeapons = function(e, data) {
    Dispatcher.addWeapons(data);
    this.save(Dispatcher.getStore('ship').currentShip);
  };

  this.removeWeapons = function(e, data) {
    Dispatcher.removeWeapons(data);
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
    this.on(document, 'addWeapons', this.addWeapons);
    this.on(document, 'removeWeapons', this.removeWeapons);

  });

});
