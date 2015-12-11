 app.controller('Ctrl1', function($scope,$http,$q,$timeout,$location) {
        
		$scope.target = $location.search().target;
		$http.get("url.properties")
		.then(function(response) {
				$http.get(response.data.shopUrl + '/' + $scope.target)
				.then(function(response1){
						$scope.designerProducts = response1;
    	
					});
			});
	});
        
