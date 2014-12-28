var flight = require('../lib/flight');

// Flux Dispatcher
var Dispatcher = require('../dispatcher');

// Mixins
var withAjax = require('../mixin/with_ajax.js');
var withShipXHR = require('../mixin/with_ship_xhr.js');

module.exports = flight.component(withAjax, withShipXHR, function() {

  this.newShip = function(e, data) {
    Dispatcher.dispatch('ship:find');
    this.trigger(document, 'showNewShip');
  }

  this.removeShip = function(e, data) {
    this.deleteShip(e, data);
    Dispatcher.dispatch('ship:delete', data);
    this.trigger(document, 'showNewShip');
  };

  this.updateShip = function(e, data) {
    Dispatcher.dispatch('ship:update', data).then(_saveValidShip.bind(this));

    function _saveValidShip(test) {
      var ship = Dispatcher.getStore('ship').currentShip;
      this.save(ship);
    }
  };

  this.save = flight.utils.throttle(function(ship) {
    console.log(ship.isValid);
    if (!ship.isValid) {
      console.log('error')
      return;
    }
    if (ship.id) {
      this.putShip(null, ship).then(function(response) {
        // console.log(response.starship);
      });
    } else {
      this.createShip(null, ship).then(function(response) {
        Dispatcher.dispatch('ship:update', response.starship);
      });
    }
  }, 2000);

  this.editShip = function(e, data) {
    Dispatcher.dispatch('ship:find', data);
    this.trigger(document, 'displayShip');
  };

  this.displayShips = function(e, data) {
    Dispatcher.dispatch('ship:reset', data);
  };

  this.addWeapons = function(e, data) {
    Dispatcher.dispatch('ship:addWeapons', data);
    this.save(Dispatcher.getStore('ship').currentShip);
  };

  this.removeWeapons = function(e, data) {
    Dispatcher.dispatch('ship:removeWeapons', data);
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
