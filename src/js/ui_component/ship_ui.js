var flight = require('../lib/flight');
var template = require('../../../templates/ships/_ship.hogan');
var ShipDispatcher = require('../dispatcher');

var shipUI = function() {

  this.displayShipInfo = function(e) {
    var starships = ShipDispatcher.getStore('ship').ships;

    this.node.innerHTML = template.render({
      starships: starships
    });
  };

  this.delegateEvents = function(e) {
    var deleteData = e.target.dataset.delete;

    if (deleteData) {
      console.log('target', deleteData);
      this.delete(e, deleteData);
    }
  };

  this.delete = function(e, data){
    this.trigger('deleteShip', { id: data });
    ShipDispatcher.delete({ id: data });
    // ShipDispatcher.dispatch('delete', { id: data });
  }

  this.after('initialize', function() {
    ShipDispatcher.on('change:all', this.displayShipInfo.bind(this));
    // this.on(document, 'displayShipInfo', this.displayShipInfo);
    this.on('click', this.delegateEvents);
  });

};

module.exports = flight.component(shipUI);
