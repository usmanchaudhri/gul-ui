
'use strict'

describe('accountServicesSpec', function() {
    var factory,
        $httpBackend,
        $q,
        $cookies,
        $scope;

    beforeEach(function() {
        module('myApp');
    });
    beforeEach(inject(function($rootScope, $injector, _$q_) {
        factory = $injector.get('accountServices');
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

        $httpBackend.whenGET(getJSONFixture('gulgs.json').loginUrl).respond(function(method, url, data, headers){
            //  return [400, "Error", {}];
            return [200, getJSONFixture('accountInfo.json'), {}];
        });

    }));

    describe('get account detail', function() {


        /**
         * Account Method
         * */

        it("should return account detail", function() {
            factory.getAccount().then(
                function(result){
                    expect(result.username).toBe("amjad@gmail.com");
                },function(result) {
                    expect(result.data).toBe("Error");
                });
            $httpBackend.flush();
        });


        /**
         * Sign in Method test cases
         */

       it("should log in user ", function() {
            factory.signIn("amjad@gmail.com","Islam").then(
                function(result){
                    expect(result).toBe(0);
                },function(result) {
                    expect(result.data).toBe("Error");
                });
            $httpBackend.flush();
        });

        it("should say invalid username or password ", function() {
            factory.signIn("amja@gmail.com","12345").then(
                function(result){
                    console.log("Account Test Case",result);
                    expect(result).toBe(1);
                },function(result) {
                    expect(result.data).toBe("Error");
                });
            $httpBackend.flush();
        });

    });

});