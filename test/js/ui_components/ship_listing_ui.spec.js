var shipUI = require('../../../src/js/ui_component/ship_listing_ui');
var Dispatcher = require('../../../src/js/dispatcher');
var mocks = require('../mocks');
var element = document.createElement('DIV');
var component;

function each(array, callback) {
  Array.prototype.forEach.call(array, callback);
}

describe('ui_component/ship_listing_ui', function(){

  beforeEach(function(){
    component = (new shipUI()).initialize(element);
    Dispatcher.reset(mocks);
  });

  afterEach(function(){
    component = (new shipUI()).initialize(element);
    Dispatcher.reset([]);
  });

  // it('should render the correct number of ships', function(next) {
  //   setTimeout(function() {
  //     var divs = component.node.querySelectorAll('.r-ship');
  //
  //     expect(divs.length).to.equal(mocks.starships.length);
  //     next();
  //   }, 100);
  // });

  it('should render each ships name', function(next) {
    setTimeout(function() {
      var ships = component.node.querySelectorAll('.r-ship-name');
      console.log(ships)

      each(ships, function(a, i) {
        var name = a.innerHTML.trim();
        expect(name).to.equal(mocks.starships[i].name);
      });
      next();
    }, 1);

  });

  it('should render a data-edit attribute for each ship with id', function(next) {
    setTimeout(function() {
      var ships = component.node.querySelectorAll('.r-ship-name');

      each(ships, function(a, i) {
        var id = a.dataset.edit;
        expect(id).to.equal(mocks.starships[i].id);
      });
      next();
    }, 1);
  });

});
