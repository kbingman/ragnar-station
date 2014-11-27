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

  this.save = flight.utils.debounce(function(ship){
    if (ship.id) {
      this.putShip(null, ship);
    } else {
      this.createShip(null, ship);
    }
  }, 500);

  this.editShip = function(e, data) {
    ShipDispatcher.find(data);
    this.trigger(document, 'displayShip')
  };

  this.displayShips = function(e, data) {
    ShipDispatcher.reset(data);
  };

  this.addCreatedShip = function(e, data) {
    console.log('created', data.starship);
    ShipDispatcher.update(data.starship);
  };

  this.after('initialize', function() {
    this.on(document, 'displayShipInfo', this.displayShips);

    this.on(document, 'getShips', this.getAllShips);
    this.on(document, 'updateShip', this.updateShip);
    this.on(document, 'deleteShip', this.removeShip);
    this.on(document, 'editShip', this.editShip);
    this.on(document, 'newShip', this.newShip);

    // temp
    this.on(document, 'addNewShipData', this.addCreatedShip);
    // this.on(document, 'removeShipData', this.log);
    // this.on(document, 'updateShipData', this.log);
  });

});
