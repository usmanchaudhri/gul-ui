
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
            return [200, getJSONFixture('gulgs.json'), {}];
        });
     }));

    describe('get test url', function() {
        it("should say cart is empty", function() {
            factory.isCartEmpty(undefined,0).then(function(result){
                console.log(result.result);
                expect(result.result).toBe(0);
            });
            $httpBackend.flush();
        });
        it("should store product in cookies", function() {
            factory.storeProductsInCookie(getJSONFixture('cart.json').product1,"s",3).then(function(result){
                console.log(result.result);
                expect(result.result).toBe("product Added");
            });
            $httpBackend.flush();
        });
        it("should say stock not available", function() {
            factory.storeProductsInCookie(getJSONFixture('cart.json').product2,"s",3).then(function(result){
                console.log(result.result);
                expect(result.result).toBe("Stock Not Available");
            });
            $httpBackend.flush();
        });
        it("should say stock not available", function() {
            factory.storeProductsInCookie(getJSONFixture('cart.json').product1,"s",5).then(function(result){
                console.log(result.result);
                expect(result.result).toBe("Quantity not Available");
            });
            $httpBackend.flush();
        });

    });

});