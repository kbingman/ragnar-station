var flight = require('../lib/flight');
// var withAjax = require('./with_ajax.js');

module.exports = function() {

  this.attributes({
    'baseUrl': '/api/'
  });

  this.getAllShips = function() {
    return this.request({
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
    return this.request({
      'xhr': {
        'path': 'ships',
        'method': 'post',
        'data': {
          'starship': data
        }
      },
      'events': {
        'fail': 'ajaxError'
      }
    });
  };

  this.putShip = function(e, data) {
    return this.request({
      'xhr': {
        'path': 'ships/' + data.id,
        'method': 'put',
        'data': {
          'starship': data
        }
      },
      'events': {
        'fail': 'ajaxError'
      }
    });
  }

  this.deleteShip = function(e, data) {
    return this.request({
      'xhr': {
        'path': 'ships/' + data.id,
        'method': 'delete'
      },
      'events': {
        'fail': 'ajaxError'
      }
    });
  };

}
