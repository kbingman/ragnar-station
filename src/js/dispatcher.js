var Flux = require('delorean.js').Flux;
var ShipStore = require('./stores/ship_store');

module.exports = Flux.createDispatcher({

  add: function(data) {
    this.dispatch('add', data);
  },
  find: function(data) {
    this.dispatch('find', data);
  },
  reset: function(data) {
    this.dispatch('reset', data);
  },
  delete: function(data) {
    this.dispatch('delete', data);
  },
  update: function(data) {
    this.dispatch('update', data);
  },
  getStores: function() {
    return {
      ship: new ShipStore()
    };
  }

});
