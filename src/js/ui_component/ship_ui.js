var flight = require('../lib/flight');
var template = require('../../../templates/ships/_ship.hogan');
var ShipDispatcher = require('../dispatcher');

module.exports = flight.component(function() {

  this.displayShipInfo = function(e) {
    var starships = ShipDispatcher.getStore('ship').ships;

    this.node.innerHTML = template.render({
      starships: starships
    });
  };

  this.delegateEvents = function(e) {
    // matches the element data attibute with functions, thereby triggering
    // the correct event. If no matching function is found, the event uses the
    // the default behaviour.
    for (var key in e.target.dataset) {
      if (this[key]) {
        this[key](e, e.target.dataset[key]);
      }
    }
  };

  this.new = function(e, data){
    e.preventDefault();
    this.trigger('newShip');
  }

  this.edit = function(e, data){
    e.preventDefault();
    this.trigger('editShip', { id: data });
  }

  this.delete = function(e, data){
    e.preventDefault();
    this.trigger('deleteShip', { id: data });
    ShipDispatcher.delete({ id: data });
    // ShipDispatcher.dispatch('delete', { id: data });
  }

  this.after('initialize', function() {
    this.trigger(document, 'getShips');
    ShipDispatcher.on('change:all', this.displayShipInfo.bind(this));
    this.on('click', this.delegateEvents);
  });

});
