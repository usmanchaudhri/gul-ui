
'use strict'

describe('cartServicesSpec', function() {
    var factory, 
        $httpBackend,
        $q,
        deferred,
        $scope;
    
    beforeEach(function() {
        module('myApp');      
    });
    beforeEach(inject(function($rootScope, $injector, _$q_) {
        factory = $injector.get('cartServices');
        $httpBackend = $injector.get('$httpBackend');
        jasmine.getJSONFixtures().fixturesPath='base/test/mock';
        $scope = $rootScope.$new();
        $q = _$q_;

        // mock http calls
        $httpBackend
            .whenGET('gulgs.properties').respond(function(method, url, data) {
            /*return getJSONFixture('gulgs.json');
             var shop = {"id": "101"};*/
            return [200, getJSONFixture('gulgs.json'), {}];
        });
     }));

    describe('get test url', function() {
        it("should get the test url", function() {
            /*factory.isCartEmpty(0,0).then(function(result){
                console.log("Returned shop result: " , getJSONFixture('cart.json').product1);
                expect(result).toBe(false);
            });*/
            factory.storeProductsInCookie(getJSONFixture('cart.json').product1,0,0).then(function(result){
                console.log("storeProductsInCookie: " , result);
                //expect(result).toBe(false);
            });
            $httpBackend.flush();
        });
    });

});