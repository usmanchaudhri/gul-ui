'use strict';

describe('CartFactory' , function() {

	var scope, 
		cartFactory, 
		cookies, 
		http;

	// load the factory modules
	beforeEach(function() {
		angular.module('myApp', 'ngCookies');

	});

	// Initialize the factory and mock scopes
	beforeEach(function($controller, $rootScope, $injector, $http) {
		scope = $rootScope.$new();
		cookies = $injector.get('$cookies');
		// how to load a factory here.
	});

	

});