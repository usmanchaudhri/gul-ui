

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

		var promise1 = $http({
			method: 'GET',
			url: '/test/url1',
			cache: true
		});

		// .success(function(data) {
		// 	console.log("Data:" + data.id);
		// 	return data;
		// });

		$q.all([promise, promise1]).then(function(data) {
			console.log("Data:" + data.id);
			console.log("Data 0:" + data[0].id);
			console.log("Data 0:" + data[1].id);
			return data;
		});
	}
	
	return service;
}]);

