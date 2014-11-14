var shipForm = require('../../../src/js/ui_component/ship_form_ui');
var Dispatcher = require('../../../src/js/dispatcher');
var mocks = require('../mocks');
var element = document.createElement('DIV');
var component;

describe('ui_component/ship_form_ui', function(){

  beforeEach(function(){
    component = (new shipForm()).initialize(element);
    // Dispatcher.reset(mocks);
  });

  afterEach(function(){
    component = (new shipForm()).initialize(element);
    // Dispatcher.reset([]);
  });

  it('should work', function() {
    console.log(component.node)
    expect(shipForm).to.be.defined;
  });

});
