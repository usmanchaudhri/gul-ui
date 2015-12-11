var app = angular.module('myApp',['ngRoute']);

app.config(['$routeProvider', function($routeProvider) 
		{ $routeProvider .when('/', { 
					templateUrl: 'view/products.html', 
					controller: 'productCtrl' 
				}); 
		}]);
