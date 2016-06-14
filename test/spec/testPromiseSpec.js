

'use strict'

describe('gulTestServicesSpec', function() {
    var factory, http, $httpBackend, $q, $scope;
    var deferred;

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
    }));

    describe('get test url', function() {
        it("should get the test url", function() {
            var result = factory.getShop();
            $httpBackend.flush();
            
            console.log("Returned shop result: " + result);
            // var result = angular.mock.dump(returnedPromise);
            // dump(result);
            // expect(promise).toBeUndefined();
        });
    });

});