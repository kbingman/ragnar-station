var Flux = require('delorean.js').Flux;
var ShipStore = require('./stores/ship_store');

module.exports = Flux.createDispatcher({

  find: function(data) {
    this.dispatch('find', data);
  },
  reset: function(data) {
    this.dispatch('reset', data);
  },
  delete: function(data) {
    this.dispatch('delete', data);
  },
  // update: function(data) {
  //   this.dispatch('update', data);
  // },
  addWeapons: function(data) {
    this.dispatch('addWeapons', data);
  },
  removeWeapons: function(data) {
    this.dispatch('removeWeapons', data);
  },
  getStores: function() {
    return {
      ship: new ShipStore()
    };
  }

});
