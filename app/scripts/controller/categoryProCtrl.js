app.controller('categoryProCtrl', ['$scope','$routeParams', 'categoryPro','sharedServices', function ($scope, $routeParams, categoryPro , sharedServices) {


	$scope.cat_id = $routeParams.catId;
	$scope.categoryProDetail = categoryPro.categoryProDetail;
	$scope.categoryIDs = categoryPro.categoryIDs;
	$scope.bannerFlag = categoryPro.banner;

	$scope.getShop = function(mName){
		//	console.log(mName);
		for(var i = 0;i < $scope.categoryIDs.length;i++){
			if(mName == $scope.categoryIDs[i].name){
				//	console.log("called");
				return $scope.categoryIDs[i].id;
			}
		}

	}
}]);