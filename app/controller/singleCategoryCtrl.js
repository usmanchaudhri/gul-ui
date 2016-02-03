app.controller('singleCatCtrl', function($scope,$http,$q,$timeout,$location,$routeParams) {
   
		$scope.cat_id = $routeParams.catId;
		$http.get("url.properties")
		.then(function(response) {
				$scope.fixPath = response.data.fixImagePath;
				$scope.token = response.data.token;
				$http.get(response.data.categoryUrl + '/' + $scope.cat_id)
				.then(function(response1){
						$scope.categoryLength = response1.data.subCategories.length;
						$scope.categoryDetail = response1.data;
    	
					});
			});
		$scope.currentPage = 1;
		$scope.pageSize = 9;
		$scope.pageChangeHandler = function(num) {
			console.log('meals page changed to ' + num);
		};
			
			
	});
        
