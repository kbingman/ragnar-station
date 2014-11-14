var Dispatcher = require('../../../src/js/dispatcher');

describe('stores/ship_stores', function(){

  describe('Initial State', function() {

    it('should set the current ship on bootstrap', function() {
      var currentShip = Dispatcher.getStore('ship').currentShip;
      expect(currentShip.name).to.equal('Not Invented Here');
    });

    it('should return the calculated ship on bootstrap', function() {
      var currentShip = Dispatcher.getStore('ship').currentShip;
      expect(currentShip.bridge).to.equal(1000);
    });

    it('should set correct number of ships on bootstrap', function() {
      var ships = Dispatcher.getStore('ship').ships;
      expect(ships.length).to.equal(2);
    });

    it('should return the calculated ships on bootstrap', function() {
      var ships = Dispatcher.getStore('ship').ships;
      expect(ships[0].bridge).to.equal(20000);
    });

  });

  describe('Ship Store events', function() {

    it('should add a ship and set it as current', function() {
      Dispatcher.add({
        id: '545f1f949c46d83e4e00000d',
        name: 'Of Course I Still Love You',
        mass: '100000',
        configuration: 'Sphere'
      });
      var ship = Dispatcher.getStore('ship').currentShip;

      expect(ship.name).to.equal('Of Course I Still Love You');
    });

    it('should remove a ship', function() {
      Dispatcher.delete({
        id: '545c53a77c6e192dc6000001'
      });
      var ship = Dispatcher.getStore('ship').find('545c53a77c6e192dc6000001');

      expect(ship).to.equal(undefined);
    });

    it('should calculate the bridge size of a new ship', function() {
      var ship = Dispatcher.getStore('ship').find('545f1f949c46d83e4e00000d');

      expect(ship.bridge).to.equal(2000);
    });

    it('should calculate the bridge size of an existing ship', function() {
      var ship = Dispatcher.getStore('ship').find('545c565f7c6e192dc6000003');

      expect(ship.bridge).to.equal(1000);
    });
  });

});
