

var app = angular.module('testApp', []);

app.factory('gulTestServices', ['$timeout', '$http', '$q', function ($timeout, $http, $q) {
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

	service.getShop = function() {
		var promise = $http({
			method: 'GET',
			url: '/test/url',
			cache: true
		});

		return $q.all([promise]).then(function(data) {
			console.log("Data:" + data[0].data.id);
			return data;
		});
	}
	
	return service;
}]);