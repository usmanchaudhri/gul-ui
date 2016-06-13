
'use strict'

describe('apiFactorySpec', function() {    
    var factory, 
        http, 
        $httpBackend, 
        authRequestHandler,
        $q,
        deferred,
        $scope;
    
    beforeEach(function() {
        module('myApp');      
    });
    
    beforeEach(inject(function($rootScope, $injector, _$httpBackend_, _$q_) {
        factory = $injector.get('apiFactory');
//        $httpBackend = $injector.get('$httpBackend');
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();
        $q = _$q_;

        // creating mock instance of defer.
        deferred = _$q_.defer();

        // use Jasmine spy to return the deferred promise.
        // spyOn(factory, 'getShop').and.returnValue(deferred.promise);

        // jasmine.createSpyObj('$cookies', ['get', 'put']);

        // backend definition common for all tests
        
        // mock backend http calls - in production the http calls
        // httpBackend to call the REST service.

        $httpBackend
        .when('GET', 'gulgs.properties')
        .respond({'shopUrl': '/shop'});
        
        var productResponse = {"id": "100", "name": "bridal dress", "quantity": "10"};
        $httpBackend
        .when('GET', '/shop/10/products')
        .respond(productResponse);

        var designerResponse = {"id": "1001", "name": "Nayyar Chaudhri", "details": "Pakistani Designer"};
        $httpBackend
        .when('GET', '/shop/10/designers')
        .respond(designerResponse);        
    }));
    
    describe('test api factory get value', function() { 
	    it("should get the value", function() {
            var value = factory.getValue();
            expect(value).toBe(10);
		});        
    });
    
    describe('apiFactoryService get url', function() {        
        it("should get the value of url", function() {
            // do something
        });        
	});
    
    describe('getting shop info', function() {
        it("should get the shop info", function() {
//            $httpBackend.expectGET('/shop/10/products');

            var shop = factory.getShop(10);

            // setup data we wish to return for the .then function
            // in the controller.
            deferred.resolve([{id:1}, {id:2}]);
            $scope.$apply();

            $httpBackend.flush();      

            console.log("Test Shop :" + shop);
            console.log("Test Shop product:" + shop.id);

            expect(shop).toBeDefined();
        });
    });
    
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
