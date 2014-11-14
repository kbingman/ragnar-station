var $ = require('jquery');
var flight = require('./lib/flight');

var shipActions = require('./actions/ship_actions');
var shipListingUI = require('./ui_component/ship_listing_ui');
var shipFormUI = require('./ui_component/ship_form_ui');

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
shipListingUI.attachTo('#starships');
shipFormUI.attachTo('#buttons');
