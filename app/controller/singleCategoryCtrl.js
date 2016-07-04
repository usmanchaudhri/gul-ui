app.controller('singleCatCtrl',['$scope','$http','$q','$timeout','$location','$routeParams','category', function($scope,$http,$q,$timeout,$location,$routeParams,category) {
   
		$scope.cat_id = $routeParams.catId;
		$scope.categoryLength = category.categoryLength;
		$scope.categoryDetail = category.categoryDetail;
		$scope.fixPath = category.fixPath;
				$scope.token = category.token;
	console.log("CATEGORY: "+category.banner);
		
		
		/*$http.get("gulgs.properties")
		.then(function(response) {
				$scope.fixPath = response.data.fixImagePath;
				$scope.token = response.data.token;
				$http.get(response.data.categoryUrl + '/' + $scope.cat_id)
				.then(function(response1){
						$scope.categoryLength = response1.data.subCategories.length;
						$scope.categoryDetail = response1.data;
					});
			});*/
			
			$scope.checkLength = function(cat){
				return cat.length;
				//console.log(cat.length);
			}
			
	}]);
        
