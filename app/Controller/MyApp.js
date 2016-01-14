var app = angular.module('myApp',['ngRoute','angularUtils.directives.dirPagination','ng-breadcrumbs','ngCookies','ngFileUpload','bootstrapLightbox']);

app.config(['$routeProvider', function($routeProvider) 
		{ $routeProvider .when('/', { 
					templateUrl: 'view/products/products.html', 
					controller: 'productCtrl',
					label:'HOME' 
				}).when('/shop/:shopId', {
					templateUrl: 'view/shop/shopProducts.html', 
					controller: 'shopCtrl',
					label:'SHOP'
				}).when('/allShops', {
					templateUrl: 'view/shop/allShops.html', 
					controller: 'allShopCtrl',
					label:'SHOP'
				})
			.when('/designerPage/:shopId', {
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
				}).when('/cart/payment', {
					templateUrl: 'view/shoppingCart/payment.html', 
					controller: 'payCtrl',
					label:'PAYMENT'
				}).when('/upload', {
					templateUrl: 'view/upload/thumbnail-gallery.html', 
					controller: 'uploadCtrl',
					label:'UPLOAD'
				}).when('/cart/payment/shipping', {
					templateUrl: 'view/shoppingCart/shipping.html', 
					controller: 'shipCtrl',
					label:'SHIPPMENT'})
					
			.otherwise({ redirectTo: '/' });
	 
		}]);
