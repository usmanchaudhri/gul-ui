
'use strict';

describe('gulTestServiceFactory', function() {

	var factory, $timeout;

	beforeEach(function() {
		module('testApp');		
	});

	beforeEach(inject(function ($injector, _$timeout_) {
		factory = $injector.get('gulTestServices');
		$timeout = _$timeout_;
	}));

	describe('TestServiceFactory test', function() {
		it('should return the default service factory value', function() {
			var value = factory.getValue();
    		expect(value).toBe(10);
		});
	});

}); 

