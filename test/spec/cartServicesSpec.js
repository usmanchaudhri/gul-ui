
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

        /**
         * IsCartEmpty Method Test cases
         */
        it("should return true because cart is empty", function() {
            factory.isCartEmpty(undefined,0).then(function(result){
                expect(result).toBe(true);
            });
            $httpBackend.flush();
        });
        it("should return false because cart is not empty", function() {
            factory.isCartEmpty(undefined,0).then(function(result){
                expect(result).toBe(false);
            });
            $httpBackend.flush();
        });

        /**
         * Store Product in Cookies Test Cookies
         */

        it("should store product in cookies", function() {
            factory.storeProductsInCookie(getJSONFixture('prodcut.json').product1,"s",3).then(function(result){
                console.log(result.result);
                expect(result.result).toBe("product Added");
            });
            $httpBackend.flush();
        });
        it("should say stock not available", function() {
            factory.storeProductsInCookie(getJSONFixture('prodcut.json').product2,"s",3).then(function(result){
                console.log(result.result);
                expect(result.result).toBe("Stock Not Available");
            });
            $httpBackend.flush();
        });
        it("should say stock not available", function() {
            factory.storeProductsInCookie(getJSONFixture('prodcut.json').product1,"s",5).then(function(result){
                console.log(result.result);
                expect(result.result).toBe("Quantity not Available");
            });
            $httpBackend.flush();
        });

        /**
         * getCartInfo Test Cases
         */

        it("should return cart info", function() {
            factory.getCartInfo().then(function(result){
                console.log("getCartInfo",result);
            });
            $httpBackend.flush();
        });

        /**
         * getCartInfo Test Cases
         */

        it("should return price of product which is only one ", function() {
            factory.cartItemsTotalPrice(getJSONFixture('cookiesProduct.json').cartProducts).then(function(result){
                console.log("cartItemsTotalPrice",result);
                expect(result).toBe(25);
            });
            $httpBackend.flush();
        });

        it("should return price of 1 items but quantity is 2", function() {
            factory.cartItemsTotalPrice(getJSONFixture('cookiesProduct.json').cartProducts1).then(function(result){
                console.log("cartItemsTotalPrice",result);
                expect(result).toBe(44);
            });
            $httpBackend.flush();
        });

        it("should return total price of total items ", function() {
            factory.cartItemsTotalPrice(getJSONFixture('cookiesProduct.json').cartProducts2).then(function(result){
                console.log("cartItemsTotalPrice",result);
                expect(result).toBe(133);
            });
            $httpBackend.flush();
        });



    });

});