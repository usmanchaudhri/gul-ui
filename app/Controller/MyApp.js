var app = angular.module('myApp',['ngRoute','angularUtils.directives.dirPagination','ng-breadcrumbs']);

app.config(['$routeProvider', function($routeProvider) 
		{ $routeProvider .when('/', { 
					templateUrl: 'view/products/products.html', 
					controller: 'productCtrl',
					label:'HOME' 
				}).when('/designerPage/:shopId', {
					templateUrl: 'view/designer/designerPage.html', 
					controller: 'Ctrl1',
					label:'DESIGNER'
				}).when('/productDetailPage/:proId', {
					templateUrl: 'view/products/individual.html', 
					controller: 'singleProCtrl',
					label:'PRODUCT'
				}).when('/categories/:catId', {
					templateUrl: 'view/categories/categoryProducts.html', 
					controller: 'singleCatCtrl',
					label:'CATEGORY'
				}).when('/cart', {
					templateUrl: 'view/shoppingCart/cart.html', 
					controller: 'cartCtrl',
					label:'CART'
				}).when('/payment', {
					templateUrl: 'view/shoppingCart/payment.html', 
					controller: 'payCtrl',
					label:'PAYMENT'
				}).when('/shipping', {
					templateUrl: 'view/shoppingCart/shipping.html', 
					controller: 'shipCtrl',
					label:'SHIPPMENT'})
					
					.otherwise({ redirectTo: '/' });
	 
		}]);
