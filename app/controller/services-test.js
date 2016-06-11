

var app = angular.module('testApp', []);

app.factory('gulTestServices', ['$timeout', function ($timeout) {
	var value = 10;
	var secondValue = 0;
	var service = {};
	service.getValue = function() {
		return value;
	}
	
	service.setValue = function() {
		value++;		
		return value;		
	}
	
	return service;
}]);

