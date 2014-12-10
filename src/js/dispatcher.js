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
  update: function(data) {
    this.dispatch('update', data).then(function(){
      console.log('promise');
    });
  },
  increase: function(data) {
    this.dispatch('increase', data);
  },
  decrease: function(data) {
    this.dispatch('decrease', data);
  },
  addWeapons: function(data) {
    this.dispatch('addWeapons', data);
  },
  getStores: function() {
    return {
      ship: new ShipStore()
    };
  }

});
