var $ = require('jquery');
var flight = require('./lib/flight');
var Flux = require('delorean.js').Flux;

/**
 * Loads Flight components
 */
// var defaultPage = require('./pages/default.js');
/**
 * Expose Globals
 */
window.$ = $;

flight.debug.enable(true);
flight.compose.mixin(flight.registry, [flight.advice.withAdvice, flight.logger]);
DEBUG.events.logAll();

/**
 * Sets up the default components
 */
// defaultPage.init();

console.log('starting');

// Store
var IncrementStore = Flux.createStore({

  actions: {
    'increase': 'increaseTotal',
    'decrease': 'decreaseTotal',
    'reset': 'resetTotal'
  },

  total: 0,
  increaseTotal: function() {
    this.total++;
    this.emit('change');
  },
  decreaseTotal: function() {
    this.total--;
    this.emit('change');
  },
  resetTotal: function() {
    this.total = 100;
    this.emit('change');
  }
});


// var incrementStore = ;

// Dispatcher
var IncrementDispatcher = Flux.createDispatcher({
  increase: function () {
    this.dispatch('increase');
  },
  decrease: function () {
    this.dispatch('decrease');
  },
  reset: function () {
    this.dispatch('reset');
  },
  getStores: function () {
    return {
      increment: new IncrementStore()
    };
  }
});

// Action Generator
var IncrementActions = {
  increase: function () {
    IncrementDispatcher.increase();
  },
  decrease: function () {
    IncrementDispatcher.decrease();
  },
  reset: function () {
    IncrementDispatcher.reset();
  }
};

// Component

var IncrementView = flight.component(function () {

  this.attributes({
    'totalDisplay': 'span'
  });

  this.render = function () {
    var total = IncrementDispatcher.getStore('increment').total;
    this.select('totalDisplay')[0].innerHTML = total;
  };

  this.after('initialize', function () {
      IncrementDispatcher.on('change:all', this.render.bind(this));
  });
});

var IncrementButtonView = flight.component(function () {
  this.attributes({
    'decreaseButton': '#decrease',
    'increaseButton': '#increase',
    'resetButton': '#reset'
  });

  this.after('initialize', function () {

    this.on('click', {
      'increaseButton': IncrementActions.increase,
      'decreaseButton': IncrementActions.decrease,
      'resetButton': IncrementActions.reset
    });
  });
});


IncrementView.attachTo('#total');
IncrementButtonView.attachTo('#buttons');
