 app.controller('Ctrl1',[ '$scope','$http','$timeout','$location','$routeParams',function($scope,$http,$q,$timeout,$location,$routeParams) {
     
		//	$scope.target = $location.search().target;
		$http.get("gulgs.properties")
		.then(function(response) {
				$scope.fixPath = response.data.fixImagePath;
				$scope.token = response.data.token;
				$scope.shop_id = $routeParams.shopId;
		
				$http.get(response.data.shopUrl +'/'+ $scope.shop_id + '/designers')
				.then(function(response1){
						$scope.designerProducts = response1.data;
    	
					});
			});
	}]);
        
