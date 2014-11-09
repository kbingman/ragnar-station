var $ = require('jquery');
var flight = require('./lib/flight');

var shipActions = require('./data_component/ship_actions');
var shipUI = require('./ui_component/ship_ui');
var createShipUI = require('./ui_component/create_ship_ui');

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

shipActions.attachTo(document);
shipUI.attachTo('#starships');
createShipUI.attachTo('#buttons');
