var flight = require('../lib/flight');
// var withAjax = require('./with_ajax.js');

module.exports = function() {

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
        'done': 'updateShipData',
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

}
