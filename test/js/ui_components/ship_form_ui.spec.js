var shipForm = require('../../../src/js/ui_component/ship_form_ui');
var Dispatcher = require('../../../src/js/dispatcher');
var mocks = require('../mocks');
var keyboard = require('../keyboard');
var element = document.createElement('DIV');
var component, ship;

describe('ui_component/ship_form_ui', function(){

  beforeEach(function(){
    component = (new shipForm()).initialize(element);
    // Add a bunch of mock ships
    Dispatcher.reset(mocks);
    // set current ship in the ship store
    Dispatcher.find(Dispatcher.getStore('ship').ships[0]);
    // trigger render
    component.trigger(document, 'displayShip');
  });

  afterEach(function(){
    component.teardown();
    setTimeout(function() {
      history.pushState({ starship: 'debug' }, 'debug', '/debug.html');
    }, 1);
  });

  describe('Ship form rendering', function(){

    it('should render the ship name', function() {
      var name = component.node.querySelector('#shipname').innerHTML.trim();

      expect(name).to.be.equal('Credibility Problem');
    });

    it('should render the ship mass', function() {
      var mass = component.node.querySelector('#shipmass').innerHTML.trim();

      expect(mass).to.be.equal('1000000');
    });

  });

  describe('Ship updating', function(){

    it('should update the ship name');
    // , function() {
    //   var nameinput = component.node.querySelector('#shipname');
    //   keyboard.keyup(nameinput, 37);
    // }

    it('should update the ship mass');

  });

});
