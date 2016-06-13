

'use strict'

describe('gulTestServicesSpec', function() {
    var factory, http, $httpBackend, $q, $scope;

    beforeEach(function() {
        module('testApp');
    });

    beforeEach(inject(function($rootScope, $injector, _$q_) {
        factory = $injector.get('gulTestServices');
        $httpBackend = $injector.get('$httpBackend');
        $scope = $rootScope.$new();
        $q = _$q_;

        // mock http calls
        $httpBackend
        .whenGET('/test/url').respond(function(method, url, data) {
            var shop = {"id": "101"};
            return [200, shop, {}];    
        });

        $httpBackend
        .whenGET('/test/url1').respond(function(method, url, data) {
            var shop = {"id": "102"};
            return [200, shop, {}];    
        });

    }));

    describe('get test url', function() {
        it("should get the test url", function() {
            var returnedPromise = factory.getShop();
            $httpBackend.flush();
            // returnedPromise.then(function(result) {
            //     console.log("Test Shop Url: " + result.id);
            // });

            // expect(promise).toBeUndefined();
        });
    });

});