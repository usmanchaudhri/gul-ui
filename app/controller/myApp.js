var app = angular.module('myApp',['infinite-scroll','ngRoute','ng-breadcrumbs','ngCookies','ngFileUpload','bootstrapLightbox','imageCropper']);

app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) 
		{ 
			//$locationProvider.html5Mode(true);
			/*if(window.history && window.history.pushState){
			$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
			});
			}*/
			$routeProvider .when('/', { 
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
				}).when('/designerPage/:shopId', {
					templateUrl: 'view/designer/designerPage.html', 
					controller: 'Ctrl1',
					label:'DESIGNER'
				}).when('/productDetailPage/:proId', {
					templateUrl: 'view/products/individual.html', 
					controller: 'singleProCtrl',
					label:'PRODUCT'
				}).when('/categoryProducts/:catId', {
					templateUrl: 'view/categories/categoryProducts.html', 
					controller: 'categoryProCtrl',
					label:'CATEGORY'
				}).when('/categories/:catId', {
					templateUrl: 'view/categories/categories.html', 
					controller: 'singleCatCtrl',
					label:'CATEGORY'
				}).when('/cart', {
					templateUrl: 'view/shoppingCart/cart.html', 
					controller: '',
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
				}).when('/chat/:chatName', {
					templateUrl: 'view/chatting/chatscreen.html', 
					controller: 'chatCtrl',
					label:'CHAT'
				}).when('/allchats', {
					templateUrl: 'view/chatting/mailscreen.html', 
					controller: 'chatCtrl',
					label:'ALL CHATS',
					resolve: {
						loadData: chatCtrl.loadData
					}
				}).when('/inspiration', {
					templateUrl: 'view/inspiration/inspiration.html', 
					controller: 'inspirationCtrl',
					label:'INSPIRATION'
				}).when('/thanku', {
					templateUrl: 'view/shoppingCart/thanku.html', 
					controller: 'thankuCtrl',
					label:'Thanku'
				}).when('/singleinspiration', {
					templateUrl: 'view/inspiration/single-inspiration-product.html', 
					controller: 'singleProductInspirationCtrl',
					label:'PRODUCT INSPIRATION'
				})
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

app.directive('closeModal', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				scope.dismiss = function() {
					element.modal('hide');
				};
			}
		} 
	});

app.directive('ngElevateZoom', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.attr('data-zoom-image',attrs.zoomImage);
				$(element).elevateZoom();
			}
		};
	});
