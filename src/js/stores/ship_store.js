var Flux = require('delorean.js').Flux;
var presets = require('../utils/presets.json');

var MIN_BRIDGE_MASS = 20;
var BRIDGE_PERCENTAGE = 0.02;

module.exports = Flux.createStore({

  /**
   * Sets up the store using local data
   */
  initialize: function (url) {
    var bootstrap = window.bootstrap || {};

    // this.set('ships', bootstrap.starships);
    this.batteries = bootstrap.batteryWeapons;
    this.pointDefense = bootstrap.pointDefenseWeapons;

    // this.setCurrentShip(bootstrap.starship);
    // bootstrap.starships = null;
    // bootstrap.starship = null;
  },

  scheme: {
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
    'find': 'setCurrentShip',
    'delete': 'removeShip',
    'update': 'updateShip',
    'addWeapons': 'addWeapons',
    'removeWeapons': 'removeWeapons'
  },

  resetShips: function(data) {
    this.set('ships', data.starships);
    this.setCurrentShip({
      id: bootstrap.currentShip
    });
    this.emit('change');
  },

  setCurrentShip: function(data) {
    if (!data || !data.id) {
      this.currentShip = {};
      return;
    }

    var ship = this.find(data.id);

    this.currentShip = ship;
    this.emit('change');
  },

  updateShip: function(data) {
    // var id = data.uuid || data.id;
    // var ship = this.find(id);
    // var index = this.ships.indexOf(ship);
    var ship = clone(this.currentShip);

    Object.keys(data).forEach(function(attr) {
      ship[attr] = data[attr];
    });

    var ship = this.calculate(ship);

    if (!ship.isValid) {
      this.emit('rollback');
      alert('hey')
      return;
    }
    this.currentShip = ship;

    // if (this.ships[index]) {
    //   this.ships[index] = this.currentShip;
    // } else {
    //   this.ships.push(this.currentShip)
    // }

    this.emit('change');
  },

  removeShip: function(data) {
    var ship = this.find(data.id);
    var index = this.ships.indexOf(ship);

    this.ships.splice(index, 1);
    this.currentShip = {};
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
    return ('00000000' + (Math.random() * Math.pow(16, 8) << 0)
      .toString(16))
      .slice(-8)
      .replace(/-/,0);
  },

  removeWeapons: function(data) {
    var ship = this.currentShip;
    var weapons = ship[data.type];
    var index = weapons.reduce(function(memo, w, i) {
      if (w.id == data.id) {
        memo = i;
      }
      return memo;
    }, undefined);

    if (index != undefined){
      weapons.splice(index, 1);
      this.emit('change');
    }
  },

  addWeapons: function(options) {
    var ship = this.currentShip;
    var count = parseInt(options.count || 0);
    var weapon = bootstrap[options.type].reduce(function(memo, w) {
      if (w.Id == options.id) {
        memo = w;
      }
      return memo;
    }, undefined);

    if (!weapon) {
      return;
    }

    ship[options.type] = ship[options.type] || [];
    ship[options.type].push({
      id: parseInt(weapon.Id),
      name: weapon.Name,
      count: count,
      cost: parseFloat(weapon.cost) * count,
      ep: parseFloat(weapon.ep) * count
    });
    this.currentShip = this.calculate(this.currentShip);
    this.emit('change');
  },

  calculate: function(ship) {

    ship.name = ship.name.replace(/\\n/,'').trim();
    ship.uuid = ship.uuid || this.generateUID();
    ship.armor = ship.armor ? parseInt(ship.armor) : 0;

    // Strip commas
    ship.mass = ship.mass ? ship.mass.toString().replace(/,/g,'') : 0;

    // Cast attributes into correct type
    ship.mass = isNaN(parseInt(ship.mass)) ? 0 : parseInt(ship.mass);
    ship.isSmallCraft = ship.mass < 100;

    ship.thrust = __setBoundary(ship.thrust);
    ship.ftl = __setBoundary(ship.ftl);
    ship.reactor = __setReactor(ship);
    ship.ep = Math.ceil((ship.reactor) * .005 * ship.mass);
    ship.power = __calculatePowerConsumption(ship);

    ship.hardpoints = __calculateAvailableHardpoints(ship);

    ship.tonnage = __calculateTonnage(ship);
    ship.crew = __calculateCrew(ship);
    // Not perfect, but it will do for now
    ship.tonnage.quarters = __calculateQuarters(ship);

    ship.prices = __calculatePrice(ship);

    ship.total = __calculateTotal(ship.tonnage);
    ship.price = __calculateTotal(ship.prices);
    ship.remaining = ship.mass - ship.total;

    ship.isValid = __checkValidity(ship);

    return ship;
  },

});

function __calculatePrice(ship) {
  var price = 0;
  return price;
}

function __checkValidity(ship) {
  var valid = true;

  // Components fit
  if (ship.remaining < 0) {
    return false;
  }

  // Power requirements are met
  if (ship.ep - ship.power < 0) {
    return false;
  }

  return valid;
}

function __calculateAvailableHardpoints(ship) {
  // TODO: subtract primary weapon mass
  return {
    pointDefense: Math.floor(ship.mass / 100),
    batteries: Math.round(ship.mass / 1000)
  };
}

function __calculateCrew(ship) {
  var crew = {
    officers: 0,
    ratings: 0
  };
  if (ship.mass <= 300) {
    crew.officers += 2; // Base command crew
  } else if (ship.mass > 300 && ship.mass < 5000) {
    crew.officers += 7; // Base command crew
  } else {
    crew.officers += 14;
  }


  // Basic support crew for command section
  if (ship.mass >= 20000) {
    crew.command = Math.round(ship.mass / 10000) * 5;
  } else {
    crew.command = Math.floor(crew.officers / 2);
  }
  crew.ratings += crew.command;
  // crew.officers += Math.floor(crew.command / 5);

  // Engineering
  crew.engineering = Math.round((ship.tonnage.ftl + ship.tonnage.reactor + ship.tonnage.thrust) / 100);
  crew.ratings += crew.engineering;
  crew.officers += Math.floor(crew.engineering / 5); // add more for bigger ships?

  // Service
  crew.service = Math.round(ship.mass / 1000) * 3;
  crew.ratings += crew.service;
  crew.officers += Math.floor(crew.service / 5);

  // Weapons

  // Troops

  // Flight crews

  return crew;
}

function __calculatePowerConsumption(ship) {
  var weapons = 0;
  if (ship.batteryWeapons) {
    ship.batteryWeapons.forEach(function(w) {
      weapons += w.ep;
    });
  }
  if (ship.pointDefenseWeapons) {
    ship.pointDefenseWeapons.forEach(function(w) {
      weapons += w.ep;
    });
  }
  return {
    weapons: weapons
  }
}

function __calculatePrice(ship) {
  var price = {};
  var tonnage = ship.tonnage;

  price.hull = bootstrap.configurations.reduce(function(memo, c) {
    if (c.name == ship.configuration) {
      memo = c.cost * 0.1 * ship.mass
    }
    return memo;
  }, 0);
  price.armor = tonnage.armor * (0.3 + 0.1);

  price.ftl = tonnage.ftl * 4;
  price.thrust = tonnage.thrust * .5;
  price.reactor = tonnage.reactor * 3;
  price.quarters = tonnage.quarters * 0.125;
  price.bridge = tonnage.quarters * 0.5;

  if (ship.batteryWeapons) {
    price.batteries = ship.batteryWeapons.reduce(function(memo, w) {
      return memo += w.cost;
    }, 0);
  }
  if (ship.pointDefenseWeapons && ship.pointDefenseWeapons.length) {
    price.pointDefense = ship.pointDefenseWeapons.reduce(function(memo, w) {
      return memo += w.cost;
    }, 0);
  }


  return price;
}

function __calculateTonnage(ship) {
  var tonnage = {
    fuel: 0
  };
  tonnage.ftl = Math.round(presets.ftl[ship.ftl] * .01 * ship.mass);
  tonnage.fuel += Math.round(ship.ftl * .1 * ship.mass);
  tonnage.thrust = Math.round((presets.thrust[ship.thrust]) * .01 * ship.mass * 10) / 10;
  tonnage.reactor = Math.round((ship.reactor) * .01 * ship.mass * 10) / 10;
  tonnage.fuel += Math.round((ship.reactor) * .005 * ship.mass * 10) / 10;
  tonnage.bridge = __setBridge(ship);
  tonnage.armor = Math.round((ship.armor + 1) * .01 * ship.mass * 10) / 10;

  if (ship.batteryWeapons) {
    tonnage.batteries = ship.batteryWeapons.reduce(function(memo, w) {
      return memo += w.count * 100;
    }, 0);
  }
  if (ship.pointDefenseWeapons) {
    tonnage.pointDefense = ship.pointDefenseWeapons.reduce(function(memo, w) {
      return memo += w.count * 1;
    }, 0);
  }

  return tonnage;
}

function __calculateTotal(parts) {
  var total = 0;
  for (var key in parts) {
    total += parts[key];
  }
  return total;
}

function __calculateQuarters(ship) {
  var tonnage = 0;
  if (ship.mass < 100) {
    return 0;
  }
  tonnage += ship.crew.officers * 4;
  tonnage += ship.crew.ratings * 2;
  // tonnage += ship.troops * 2;
  // tonnage += ship.passengers * 4;
  return tonnage;
}

function __setReactor(ship) {
  var reactor = __setBoundary(ship.reactor, 30);
  reactor = reactor > ship.thrust ? reactor : ship.thrust;
  reactor = reactor > ship.ftl ? reactor : ship.ftl;

  return reactor;
}

function __setBridge(ship) {
  var bridge;
  if (ship.mass < 100) {
    return 4;
  }

  bridge = ship.mass * BRIDGE_PERCENTAGE;
  bridge = Math.round(bridge > MIN_BRIDGE_MASS ? bridge : MIN_BRIDGE_MASS);
  return bridge;
}

function __setBoundary(attr, limit) {
  limit = limit || 6;
  attr = isNaN(attr) ? 0 : parseInt(attr);
  attr = attr < 0 ? 0 : attr;
  attr = attr > limit ? limit : attr;
  return attr;
}

function clone(obj) {
  if(obj == null || typeof(obj) != 'object') {
    return obj;
  }
  var temp = obj.constructor(); // changed

  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      temp[key] = clone(obj[key]);
    }
  }
  return temp;
}
