'use strict';

describe('Service: Country', function () {

    var Country;
    
    // Load the module
    beforeEach(module('stadion'));

    // Instantiate service
    beforeEach(inject(function (_Country_) {
        Country = _Country_;
    }));

    // Other tests check already that the controllers are interacting with the right service
    it('should create a Country service', function () {
        expect(!!Country).toBe(true);
    });

});
