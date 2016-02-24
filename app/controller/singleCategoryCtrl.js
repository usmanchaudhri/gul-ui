app.controller('singleCatCtrl',['$scope','$http','$q','$timeout','$location','$routeParams', function($scope,$http,$q,$timeout,$location,$routeParams) {
   
		$scope.cat_id = $routeParams.catId;
		$http.get("gulgs.properties")
		.then(function(response) {
				$scope.fixPath = response.data.fixImagePath;
				$scope.token = response.data.token;
				$http.get(response.data.categoryUrl + '/' + $scope.cat_id)
				.then(function(response1){
						$scope.categoryLength = response1.data.subCategories.length;
						$scope.categoryDetail = response1.data;
					});
			});
			
			$scope.checkLength = function(cat){
				return cat.length;
				//console.log(cat.length);
			}
			
	}]);
        
