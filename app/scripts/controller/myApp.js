var app = angular.module('myApp', ['infinite-scroll', 'ngRoute', 'ng-breadcrumbs', 'ngCookies', 'ngFileUpload', 'bootstrapLightbox', 'imageCropper', 'ui.bootstrap','cfp.loadingBar']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	//$locationProvider.html5Mode(true);
	/*if(window.history && window.history.pushState){
	 $locationProvider.html5Mode({
	 enabled: true,
	 requireBase: false
	 });
	 }*/
	$routeProvider.when('/', {
		templateUrl: 'view/products/products.html',
		controller: 'productCtrl',
		label: 'HOME'
	}).when('/shop/:shopId', {
		templateUrl: 'view/shop/shopProducts.html',
		controller: 'shopCtrl',
		label: 'SHOP',
		resolve: {
			getShop: function (shopServices, $route) {
				return shopServices.getShop($route.current.params.shopId);
			}
		}
	}).when('/allShops', {
		templateUrl: 'view/shop/allShops.html',
		controller: 'allShopCtrl',
		label: 'SHOP',
		resolve: {
			allShopsList: function (shopServices) {
				return shopServices.getallShops();

			}
		}
	}).when('/designerPage/:shopId', {
		templateUrl: 'view/designer/designerPage.html',
		controller: 'Ctrl1',
		label: 'DESIGNER'
	}).when('/newShop', {
		templateUrl: 'view/upload/createShop.html',
		controller: 'uploadCtrl',
		label: 'SHOP'
	}).when('/productDetailPage/:proId', {
		templateUrl: 'view/products/individual.html',
		controller: 'singleProductCtrl',
		label: 'PRODUCT',
		resolve: {
			productDetail: function (productServices, $route) {
				return productServices.getProductDetail($route.current.params.proId);

			}
		}
	}).when('/categoryProducts/:catId', {
		templateUrl: 'view/categories/categoryProducts.html',
		controller: 'categoryProductCtrl',
		label: 'CATEGORY',
		resolve: {
			categoryPro: function (categoryServices, $route) {
				return categoryServices.getCategoryProduct($route.current.params.catId);

			}
		}
	}).when('/categories/:catId', {
		templateUrl: 'view/categories/categories.html',
		controller: 'singleCatCtrl',
		label: 'CATEGORY',
		resolve: {
			category: function (categoryServices, $route) {
				return categoryServices.getCategory($route.current.params.catId);

			}
		}
	}).when('/cart', {
		templateUrl: 'view/shoppingCart/cart.html',
		controller: '',
		label: 'CART'
	}).when('/cart/payment', {
		templateUrl: 'view/shoppingCart/payment.html',
		controller: 'payCtrl',
		label: 'PAYMENT'
	}).when('/upload', {
		templateUrl: 'view/upload/uploadImages.html',
		controller: 'uploadCtrl',
		label: 'UPLOAD'
	}).when('/cart/payment/shipping', {
		templateUrl: 'view/shoppingCart/shipping.html',
		controller: 'shipCtrl',
		label: 'SHIPPMENT'
	}).when('/chat/:chatName', {
		templateUrl: 'view/chatting/chatscreen.html',
		controller: 'conversationCtrl',
		label: 'CHAT',
		resolve: {
			conList: function (chatServices, $route, $cookies) {
				if ($cookies.get("username") != null) {
					return chatServices.getConversationList($route.current.params.chatName);

				} else {
					$location.path("#/");
				}
			}
		}
	}).when('/allchats', {
		templateUrl: 'view/chatting/mailscreen.html',
		controller: 'chatCtrl',
		label: 'ALL CHATS',
		resolve: {
			chatList: function (chatServices, $cookies, $location) {
				if ($cookies.get("username") != null) {
					return chatServices.getChatList();
				} else {
					$location.path("#/");
				}
			}
		}
	}).when('/inspiration', {
		templateUrl: 'view/inspiration/inspiration.html',
		controller: 'inspirationCtrl',
		label: 'INSPIRATION'
	}).when('/thanku', {
		templateUrl: 'view/shoppingCart/thanku.html',
		controller: 'thankuCtrl',
		label: 'Thanku'
	}).when('/singleinspiration', {
		templateUrl: 'view/inspiration/single-inspiration-product.html',
		controller: 'singleProductInspirationCtrl',
		label: 'PRODUCT INSPIRATION'
	}).when('/shipping', {
		templateUrl: 'view/userInfo/newshipping.html',
		controller: 'shipCtrl',
		label: 'SHIPPING',
		resolve: {
			shippingList: function (shippingServices, $cookies, $location) {
				if ($cookies.get("username") != null) {
					return shippingServices.getShippingList();
				} else {
					$location.path("#/");
				}
			}
		}
	}).when('/myorder', {
		templateUrl: 'view/userInfo/order.html',
		controller: 'orderCtrl',
		label: 'ORDER',
		resolve: {
			orderList: function (orderServices, $cookies, $location) {
				if ($cookies.get("username") != null) {
					return orderServices.getOrder();
				} else {
					$location.path("#/");
				}
			}
		}
	}).when('/account', {
				templateUrl: 'view/userInfo/editProfile.html',
				controller: 'accountCtrl',
				label: 'MY ACCOUNT',
				resolve: {
					accountDetails: function (accountServices, $cookies, $location) {
						if ($cookies.get("username") != null) {
							return accountServices.getAccount();
						} else {
							$location.path("#/");
						}
					}
				}
			})
			.otherwise({redirectTo: '/'});

}]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
	cfpLoadingBarProvider.includeSpinner = false;
}]);

app.directive('progressbar', [function () {
	return {
		restrict: 'A',
		scope: {
			'progress': '=progressbar'
		},
		controller: function ($scope, $element, $attrs) {
			$element.progressbar({
				value: $scope.progress
			})

			$scope.$watch(function () {
				$element.progressbar({value: $scope.progress})
			})
		}
	}
}]);
app.directive('closeModal', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			scope.dismiss = function () {
				element.modal('hide');
			};
		}
	}
});
app.directive('ngElevateZoom', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.attr('data-zoom-image', attrs.zoomImage);
			$(element).elevateZoom();
		}
	};
});