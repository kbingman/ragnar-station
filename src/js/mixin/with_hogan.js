var flight = require('../lib/flight');

module.exports = function withFormUtils() {

  this.render = function(template, data, partials) {

    var renderer = function(context) {
      return function(text) {
        return template.c.compile(text, template.options).render(context, partials);
      };
    };

    var utils = {
      format: function() {
        return function(text){
          var render = renderer(this);
          var num = (Math.round(parseFloat(render(text)) * 100) / 100).toFixed(2);
          var digits = num.split('.')[0];
          var fraction = num.split('.')[1];

          return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + fraction;
        };
      },
      round: function() {
        return function(text){
          var render = renderer(this);
          var num = (Math.round(parseFloat(render(text)) * 100) / 100).toFixed(0);

          return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };
      }
    };

    return template.render(flight.utils.merge(utils, data), partials);
  }

}
