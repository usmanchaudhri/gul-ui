 app.controller('Ctrl1', function($scope,$http,$q,$timeout,$location) {
        
		$scope.target = $location.search().target;
		$http.get("url.properties")
		.then(function(response) {
				$http.get(response.data.shopUrl + '/' + $scope.target)
				.then(function(response1){
						$scope.designerProducts = response1;
    	
					});
    	});
		/*	var promise3 = $http({method: 'GET', url: 'https://gul-product-service.herokuapp.com/gul-product-service/shop/'+$scope.target, cache: 'true'});
		
		
		
		$q.all([promise3]).then(function(data){
		$scope.designerProducts = data[0];
		});
		*/
   
   
	}
);
        
