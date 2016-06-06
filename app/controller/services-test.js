

var app = angular.module('testApp', []);

app.controller('testCtrl', ['$timeout', function ($timeout) {
		
}]);

app.factory('gulTestServices', [$timeout, function ($timeout) {
	var value = 10;
	var service = {};
	service.getValue = function() {
		return value;
	}
	return service;
}]);

