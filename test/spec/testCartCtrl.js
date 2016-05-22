'use strict';

describe('Controller: cartCtrl', function() {

	// load the controller's module
	// beforeEach(module('myApp'));

	// Define dependencies needed
	beforeEach(function() {
		angular.module('myApp');
		angular.module('infinite-scroll', []);
		angular.module('ngRoute', []);
		angular.module('ngCookies', 'myApp');
		angular.module('ngRoute', []);
	});

	var cartCtrl, scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $cookieStore, $http, Base64, $window, $location, $rootScope, $timeout) {
		scope = $rootScope.$new();
		cartCtrl = $controller('cartCtrl', {
			$scope: scope
			// place here mocked dependencies
		});
	}));

	it('should get item size in cart', function () {
		scope.getItemSize();
		expect(scope.items).toBe(true);
	});

});
