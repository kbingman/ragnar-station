var flight = require('../lib/flight');
var withAjax = require('../mixin/with_ajax.js');

var shipXHR = function() {

  this.attributes({
    'baseUrl': '/api/'
  });

  this.getAllShips = function() {
    this.request({
      'xhr': {
        'path': 'ships'
      },
      'events': {
        'done': 'displayShipInfo',
        'fail': 'ajaxError'
      }
    });
  };

  this.createShip = function(e, data) {
    this.request({
      'xhr': {
        'path': 'ships',
        'method': 'post',
        'data': {
          'starship': data
        }
      },
      'events': {
        'done': 'addNewShipData',
        'fail': 'ajaxError'
      }
    });
  };

  this.updateShip = function(e, data) {
    this.request({
      'xhr': {
        'path': 'ships/' + data.id,
        'method': 'put',
        'data': {
          'starship': data
        }
      },
      'events': {
        'done': 'successfullyUpdatedShipData',
        'fail': 'ajaxError'
      }
    });
  }

  this.deleteShip = function(e, data) {
    this.request({
      'xhr': {
        'path': 'ships/' + data.id,
        'method': 'delete'
      },
      'events': {
        'done': 'removeShipData',
        'fail': 'ajaxError'
      }
    });
  };

  this.after('initialize', function() {
    this.on(document, 'getShips', this.getAllShips);
    this.on(document, 'createShip', this.createShip);
    this.on(document, 'updateShip', this.updateShip);
    this.on(document, 'deleteShip', this.deleteShip);
  });

}

module.exports = flight.component(withAjax, shipXHR);
