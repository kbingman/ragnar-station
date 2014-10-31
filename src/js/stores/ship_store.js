var Flux = require('delorean.js').Flux;

module.exports = Flux.createStore({
  actions: {
    'reset': 'resetShips',
    'add': 'addShip',
    'delete': 'removeShip'
  },

  ships: [],

  resetShips: function(data) {
    this.ships = data.starships;
    this.emit('change');
  },

  addShip: function(data) {
    this.ships.push(data);
    this.emit('change');
  },

  removeShip: function(data) {
    var ship = this.ships.filter(function(s) {
      return s.id == data.id;
    })[0];
    var index = this.ships.indexOf(ship);

    this.ships.splice(index, 1);
    this.emit('change');
  }
});
