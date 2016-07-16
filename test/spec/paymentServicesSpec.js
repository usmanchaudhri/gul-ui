
'use strict'

describe('paymentServicesSpec', function() {
    var factory,
        $httpBackend,
        $q,
        $cookies,
        $scope;

    beforeEach(function() {
        module('myApp');
    });
    beforeEach(inject(function($rootScope, $injector, _$q_) {
        factory = $injector.get('paymentServices');
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
        $cookies.put("username", JSON.stringify(value));
        $cookies.put("invoices", JSON.stringify(getJSONFixture('cookiesProduct.json').cartProducts));
        $cookies.put("userId", "1");
        $httpBackend
            .whenGET('gulgs.properties').respond(function(method, url, data) {
            return [200, getJSONFixture('gulgs.json'), {}];
        });

        /*$httpBackend.whenPOST(getJSONFixture('cookiesProduct.json').cartProducts).respond(function(method, url, data, headers){
            //  return [400, "Error", {}];
            return [200, data, {}];
        });*/

        $httpBackend.whenPOST(getJSONFixture('gulgs.json').getToken).respond(function(method, url, data, headers){
            //  return [400, "Error", {}];
            return [200, getJSONFixture('getToken.json'), {}];
        });
        $httpBackend.whenPOST(getJSONFixture('gulgs.json').submitPaymentUrl).respond(function(method, url, data, headers){
            //  return [400, "Error", {}];
            return [200, getJSONFixture('paymentPayload.json'), {}];
        });
    }));

    describe('get test url', function() {


        /**
         * SubmitPayment Test cases
         */

        it("should return success result because payment is submited ", function() {
            factory.submitPayment(20,getJSONFixture('paymentPayload.json')).then(
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