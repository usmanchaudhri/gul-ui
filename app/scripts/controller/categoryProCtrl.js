app.controller('categoryProCtrl', ['$scope','$routeParams', 'categoryPro','utilityServices', function ($scope, $routeParams, categoryPro , utilityServices) {


	$scope.cat_id = $routeParams.catId;
	$scope.categoryProDetail = categoryPro.categoryProDetail;
	$scope.categoryIDs = categoryPro.categoryIDs;
	$scope.bannerFlag = categoryPro.banner;

	$scope.getShop = function(mName){
		for(var i = 0;i < $scope.categoryIDs.length;i++){
			if(mName == $scope.categoryIDs[i].name){
				return $scope.categoryIDs[i].id;
			}
		}
	}
}]);