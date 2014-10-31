var Flux = require('delorean.js').Flux;
var ShipStore = require('./stores/ship_store');

module.exports = Flux.createDispatcher({

  add: function(data) {
    this.dispatch('add', data);
  },
  reset: function(data) {
    this.dispatch('reset', data);
  },
  delete: function(data) {
    this.dispatch('delete', data);
  },
  getStores: function() {
    return {
      ship: new ShipStore()
    };
  }

});
