
'use strict'

describe('shippingServicesSpec', function() {
    var factory,
        $httpBackend,
        $q,
        $cookies,
        $scope;

    beforeEach(function() {
        module('myApp');
    });
    beforeEach(inject(function($rootScope, $injector, _$q_) {
        factory = $injector.get('shippingServices');
        $httpBackend = $injector.get('$httpBackend');
        $cookies = $injector.get('$cookies');
        jasmine.getJSONFixtures().fixturesPath='base/test/mock';
        $scope = $rootScope.$new();
        $q = _$q_;
        // mock http calls
        var value = {
            "username": "amjad@gmail.com",
            "password": "abc",
            "id": "1",
            "shopId": JSON.stringify("20")
        };
        $httpBackend
            .whenGET('gulgs.properties').respond(function(method, url, data) {
            return [200, getJSONFixture('gulgs.json'), {}];
        });

        $httpBackend.whenPOST(getJSONFixture('gulgs.json').submitPaymentUrl).respond(function(method, url, data, headers){
            //  return [400, "Error", {}];
            return [200, getJSONFixture('paymentPayload.json'), {}];
        });
    }));

    describe('get test url', function() {


        /**
         * Get ShippingList Test cases
         */

        it("should return success result because payment is submited ", function() {
            factory.getShippingList(20,getJSONFixture('paymentPayload.json')).then(
                function(result){
                    //  console.log("result",$cookies.get("username"));
                    expect(result).toBe("success");
                },function(result) {
                    expect(result.data).toBe("Error");
                });
            $httpBackend.flush();
        });
    });

});