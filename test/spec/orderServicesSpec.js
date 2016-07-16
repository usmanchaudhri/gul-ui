'use strict'

describe('orderServicesSpec', function () {
    var factory,
        $httpBackend,
        $q,
        $cookies,
        $scope;

    beforeEach(function () {
        module('myApp');
    });
    beforeEach(inject(function ($rootScope, $injector, _$q_) {
        factory = $injector.get('orderServices');
        $httpBackend = $injector.get('$httpBackend');
        $cookies = $injector.get('$cookies');
        jasmine.getJSONFixtures().fixturesPath = 'base/test/mock';
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
        $cookies.put("userId", "1");
        $httpBackend
            .whenGET('gulgs.properties').respond(function (method, url, data) {
            return [200, getJSONFixture('gulgs.json'), {}];
        });

        $httpBackend
            .whenGET(getJSONFixture('gulgs.json').customerUrl+"/1/order").respond(function (method, url, data) {
            return [200, getJSONFixture('gulgs.json'), {}];
        });

        $httpBackend.whenPOST(getJSONFixture('gulgs.json').orderUrl).respond(function (method, url, data, headers) {
              return [200, "Error", {}];
           // return [200, data, {}];
        });

    }));

    describe('get test order submission', function () {



        /**
         * Get Order Test Cases
         */

        it("should return Order Detail ", function () {
            factory.submitOrder(getJSONFixture('order.json')).then(
                function (result) {
                    console.log("success");
                    expect(result).toBe("success");
                }, function (data) {
                    console.log("Error");
                });
            $httpBackend.flush();
        });

        /**
         * submitOrder Test cases
         */

        it("should return Success when HTTP response is 200 ", function () {
            factory.submitOrder(getJSONFixture('order.json')).then(
                function (result) {
                    console.log("success");
                    expect(result).toBe("success");
                }, function (data) {
                    console.log("Error");
                });
            $httpBackend.flush();
        });

        it("should return Error when HTTP response is not 200 ", function () {
            factory.submitOrder(getJSONFixture('order.json')).then(
                function (result) {
                    expect(result).toBe("success");
                }, function (result) {
                    expect(result.data).toBe("Error");
                });
            $httpBackend.flush();
        });


    });

});