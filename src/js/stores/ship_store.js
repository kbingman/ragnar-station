var Flux = require('delorean.js').Flux;

var CHANGE_EVENT = 'change'
var MIN_BRIDGE_MASS = 20;
var BRIDGE_PERCENTAGE = 0.02;

module.exports = Flux.createStore({

  /**
   * Sets up the store using local data
   */
  initialize: function (url) {
    var bootstrap = window.bootstrap || {};

    this.set('ships', bootstrap.starships);
    this.setCurrentShip(bootstrap.starship);
    bootstrap.starships = null;
    bootstrap.starship = null;
  },

  scheme: {
    // currentShip: {
    //   default: null,
    //   calculate: function(){
    //     return this.calculate(this.ship);
    //   }
    // },
    ships: {
      default: [],
      calculate: function(){
        return this.ships.map(function(ship){
          return this.calculate(ship);
        }, this);
      }
    }
  },

  actions: {
    'reset': 'resetShips',
    'add': 'addShip',
    'find': 'setCurrentShip',
    'delete': 'removeShip',
    'update': 'updateShip'
  },

  resetShips: function(data) {
    this.set('ships', data.starships);
    this.emit('change');
  },

  setCurrentShip: function(data) {
    var ship = this.find(data.id);

    if (data.id == 'new') {
      this.currentShip = {
        id: 'new'
      };
      this.emit('change');
      return;
    }

    this.currentShip = ship;
    this.emit('change');
  },

  addShip: function(data) {
    this.currentShip = this.calculate(data);
    this.ships.push(this.currentShip);
    this.emit('change');
  },

  updateShip: function(data) {
    var ship = this.find(data.id);
    var index = this.ships.indexOf(ship);

    this.currentShip = data;
    this.ships[index] = this.currentShip;
    this.emit('change');
  },

  removeShip: function(data) {
    var ship = this.find(data.id);
    var index = this.ships.indexOf(ship);

    this.ships.splice(index, 1);
    this.currentShip = null;
    this.emit('change');
  },

  find: function(id) {
    return this.ships.filter(function(s) {
      return s.id == id;
    })[0];
  },

  calculate: function(ship) {
    if (!ship) {
      return;
    }
    var bridge = ship.mass * BRIDGE_PERCENTAGE;

    ship.bridge = Math.round(bridge > MIN_BRIDGE_MASS ? bridge : MIN_BRIDGE_MASS);

    return ship;
  }

});
