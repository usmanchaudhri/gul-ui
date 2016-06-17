app.controller('categoryProCtrl', ['$scope','$routeParams', 'categoryPro','commonFactory', function ($scope, $routeParams, categoryPro , commonFactory) {


	$scope.cat_id = $routeParams.catId;
	$scope.categoryProDetail = categoryPro.categoryProDetail;
	$scope.categoryIDs = categoryPro.categoryIDs;
	$scope.bannerFlag = categoryPro.banner;

	$scope.getShop = function (mName) {
		commonFactory.getShop(mName,$scope.categoryIDs).then(function(data){
			console.log("categoryProCtrl",data);
			return data;
		});
	}
}]);