var Dispatcher = require('../../../src/js/dispatcher');
var mocks = require('../mocks');
var ship = mocks.starships[0]

describe('stores/ship_stores', function(){

  beforeEach(function() {
    Dispatcher.reset(mocks);
    Dispatcher.find(ship);
    // Dispatcher.find(mocks[0]);
    console.log(ship);
  });

  describe('Initial State', function() {

    it('should set the current ship on bootstrap', function() {
      var currentShip = Dispatcher.getStore('ship').currentShip;
      expect(currentShip.name).to.equal(ship.name);
    });

    it('should return the calculated ship on bootstrap', function() {
      var currentShip = Dispatcher.getStore('ship').currentShip;
      expect(currentShip.tonnage.bridge).to.equal(ship.tonnage.bridge);
    });

    it('should set correct number of ships on bootstrap', function() {
      var ships = Dispatcher.getStore('ship').ships;
      expect(ships.length).to.equal(mocks.starships.length);
    });

    it('should return the calculated ships on bootstrap', function() {
      var ships = Dispatcher.getStore('ship').ships;
      expect(ships[0].tonnage.bridge).to.equal(20000);
    });

    it('should return a UUID even if the ship does not have one', function() {
      var ships = Dispatcher.getStore('ship').ships;
      expect(ships[0].uuid.length).to.equal(8);
    });

  });

  describe('Ship Store functions', function() {

    it('should add a ship and set it as current', function() {
      Dispatcher.update({
        id: '545f1f949c46d83e4e00000d',
        name: 'Of Course I Still Love You',
        mass: '100000',
        configuration: 'Sphere'
      });
      var ship = Dispatcher.getStore('ship').currentShip;

      expect(ship.name).to.equal('Of Course I Still Love You');
    });

    it('should add a ship and set a UUID for it', function() {
      Dispatcher.update({
        id: '545f1f949c46d83e4e00000f',
        name: 'Me, I\'m Counting',
        mass: '100000',
        configuration: 'Sphere'
      });
      var ship = Dispatcher.getStore('ship').currentShip;

      expect(ship.uuid).to.be.defined;
      expect(ship.uuid.length).to.equal(8);
    });

    it('should remove a ship', function() {
      Dispatcher.delete({
        id: '545c53a77c6e192dc6000001'
      });
      var ship = Dispatcher.getStore('ship').find('545c53a77c6e192dc6000001');

      expect(ship).to.equal(undefined);
    });

    it('should calculate the bridge size of a new ship', function() {
      Dispatcher.update({
        id: '545f1f949c46d83e4e00000f',
        name: 'Who\'s Counting?',
        mass: '100000',
        configuration: 'Sphere'
      });
      var ship = Dispatcher.getStore('ship').currentShip;

      expect(ship.tonnage.bridge).to.equal(2000);
    });

    it('should calculate the bridge size of an existing ship', function() {
      var ship = Dispatcher.getStore('ship').find('545c565f7c6e192dc6000003');

      expect(ship.tonnage.bridge).to.equal(1000);
    });
  });

  describe('Ship Store events', function() {

    it('should find ships');

    it('should reset ships');

    it('should delete ships');

    it('should update ships');

    it('should increment ship attributes');

    it('should addWeapons ships');

  });

});
