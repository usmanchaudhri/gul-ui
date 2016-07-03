

'use strict'

describe('gulTestServicesSpec', function() {
    var factory, $httpBackend, $q, $scope;

    beforeEach(function() {
        module('testApp');
    });

    beforeEach(inject(function($rootScope, $injector, _$q_) {
        factory = $injector.get('gulTestServices');
        $httpBackend = $injector.get('$httpBackend');
        jasmine.getJSONFixtures().fixturesPath='base/test/mock';
        $scope = $rootScope.$new();
        $q = _$q_;
        
        // mock http calls
        $httpBackend
        .whenGET('/test/url').respond(function(method, url, data) {
            console.log("FIXTURE",getJSONFixture('gulgs.json'));
            var shop = {"id": "101"};
            return [200, shop, {}];
        });
    }));

    describe('get test url', function() {
        it("should get the test url", function() {
            factory.getShop().then(function(result){
                console.log("Returned shop result: " + result);
                expect(result[0].data.id).toBe('101');
            });
            $httpBackend.flush();
            
            // var result = angular.mock.dump(returnedPromise);
            // dump(result);
            // expect(promise).toBeUndefined();
        });
    });

});