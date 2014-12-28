var Flux = require('delorean.js').Flux;
var ShipStore = require('./stores/ship_store');

module.exports = Flux.createDispatcher({

  getStores: function() {
    return {
      ship: new ShipStore()
    };
  }

});
