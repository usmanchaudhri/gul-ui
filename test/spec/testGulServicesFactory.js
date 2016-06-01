
'use strict';

describe('gulServicesFactory', function() {

	var scope, factory, cookies, subController, $provide;

	// loading the factory modules.
	beforeEach(function() {
		module('myApp', 'ngCookies');
		module(function($provide) {
			$provide.value('gulServiceCall', {
				someVariable: 1
			});
		});
	});

	// Initializaing the factory and mock scope.
	beforeEach(inject(function ($controller, $rootScope, $injector, $http) {
		scope = $rootScope.new();
		factory = $injector.get('gulServices');
	}));

	describe('ServiceFactory', function() {
		it("should fetch chat", function() {
			var chat = factory.getChat();
			expect(chat).toBe­Def­ine­d();
		});
	});


});