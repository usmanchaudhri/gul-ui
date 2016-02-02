var app = angular.module('myApp',['infinite-scroll','ngRoute','ng-breadcrumbs','ngCookies','ngFileUpload','bootstrapLightbox','imageCropper']);

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
					templateUrl: 'view/upload/uploadImages.html', 
					controller: 'uploadCtrl',
					label:'UPLOAD'
				}).when('/cart/payment/shipping', {
					templateUrl: 'view/shoppingCart/shipping.html', 
					controller: 'shipCtrl',
					label:'SHIPPMENT'
				}).when('/chat', {
					templateUrl: 'view/chatting/chatting.html', 
					controller: 'chatCtrl',
					label:'CHAT'})
					
			.otherwise({ redirectTo: '/' });
	 
		}]);
app.directive('progressbar', [function() {
    return {
        restrict: 'A',
        scope: {
            'progress': '=progressbar'
        },
        controller: function($scope, $element, $attrs) {
            $element.progressbar({
                value: $scope.progress
            })

            $scope.$watch(function() {
                $element.progressbar({value: $scope.progress})
            })
        }
    }
}]);