app.controller('singleCatCtrl', ['$scope',  '$routeParams', 'category', function ($scope, $routeParams, category) {

	console.log("SINGLE CAT : ",category);
	$scope.cat_id = $routeParams.catId;
	$scope.categoryLength = category.categoryLength;
	$scope.categoryDetail = category.categoryDetail;
	$scope.fixPath = category.fixPath;
	$scope.token = category.token;

}]);
