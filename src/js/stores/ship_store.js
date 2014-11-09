var Flux = require('delorean.js').Flux;

var CHANGE_EVENT = 'change'

module.exports = Flux.createStore({

  /**
   * Sets up the store using local data
   */
  initialize: function (url) {
    this.ships = bootstrap.starships;
    this.currentShip = bootstrap.starship;
    bootstrap.starships = null;
    bootstrap.starship = null;
  },

  actions: {
    'reset': 'resetShips',
    'add': 'addShip',
    'find': 'findShip',
    'delete': 'removeShip',
    'update': 'updateShip'
  },

  ships: [],

  ship: null,

  resetShips: function(data) {
    console.log(data);
    this.ships = data.starships;
    this.emit('change');
  },

  findShip: function(data) {
    var ship = this.ships.filter(function(s) {
      return s.id == data.id;
    })[0];
    this.currentShip = ship;
    console.log('ship', ship);
    this.emit('change');
  },

  addShip: function(data) {
    this.currentShip = data;
    this.ships.push(data);
    this.emit('change');
  },

  updateShip: function(data) {
    var ship = this.ships.filter(function(s) {
      return s.id == data.id;
    })[0];
    var index = this.ships.indexOf(ship);

    this.currentShip = ship;
    this.ships[index] = data;
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
