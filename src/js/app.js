var $ = require('jquery');
var flight = require('./lib/flight');

var shipXHR = require('./data_component/ship_xhr');
var shipResponder = require('./data_component/ship_responder');
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

shipResponder.attachTo(document);
shipXHR.attachTo(document);
shipUI.attachTo('#starships');
createShipUI.attachTo('#buttons');
