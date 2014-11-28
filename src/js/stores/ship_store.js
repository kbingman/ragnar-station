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
    // 'add': 'addShip',
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

  updateShip: function(data) {
    var id = data.uuid || data.id;
    var ship = this.find(id);
    var index = this.ships.indexOf(ship);

    this.currentShip = this.calculate(data);
    if (this.ships[index]) {
      this.ships[index] = this.currentShip;
    } else {
      this.ships.push(this.currentShip)
    }

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
      return s.uuid == id || s.id == id;
    })[0];
  },

  /**
  * Util method. Generates a unique ID
  */
  generateUID: function() {
    return ('00000000' + (Math.random() * Math.pow(16, 8) << 0).toString(16)).slice(-8);
  },

  calculate: function(ship) {
    if (!ship) {
      return;
    }

    // Cast attributes into correct type
    ship.mass = isNaN(parseInt(ship.mass)) ? 0 : parseInt(ship.mass);
    ship.thrust = ship.thrust ? parseInt(ship.thrust) : 0;
    ship.ftl = ship.ftl ? parseInt(ship.ftl) : 0;
    ship.name = ship.name.replace(/\\n/,'').trim();
    ship.uuid = ship.uuid || this.generateUID();

    // Calculate ship parts
    var bridge = ship.mass * BRIDGE_PERCENTAGE;
    ship.bridge = Math.round(bridge > MIN_BRIDGE_MASS ? bridge : MIN_BRIDGE_MASS);

    return ship;
  }

});
