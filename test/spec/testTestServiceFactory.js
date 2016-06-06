
'use strict';

describe('gulTestService', function() {

	var scope, 
		factory, 
		q,
		deferred,
		timeout;

	beforeEach(function() {
		module('testApp', 'ngMock');
		module(function($provide) {
			$provide.decorator('$timeout', function($delegate) {
				return sinon.spy($delegate);				
		      	// return jasmine.spyOn();			
			});						
			// jasmine.createSpyObj('$timeout', ['cancel']);   // creating cookies mock object for get and put calls.			
	    });
	});

	beforeEach(inject(function ($injector) {
		timeout = $injector.get('$timeout');
		factory = $injector.get('gulTestServices');
	}));

	describe('TestServiceFactory test', function() {
		it('should return the default service factory value', function() {
			var value = factory.getValue();
    		expect(value).toBe(10);
		});
	});

}); 

