app.controller('shopCtrl',['$scope','$routeParams','getShop', function($scope,$routeParams,getShop) {
   
		$scope.shop_id = $routeParams.shopId;
		$scope.shop = getShop.shop;
		$scope.designer = getShop.designer;
		$scope.fixPath = getShop.fixPath;
		$scope.fixPathShop = getShop.fixPathShop;
		}]);
