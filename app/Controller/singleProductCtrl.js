app.controller('singleProCtrl', function($scope,$http,$q,$timeout,$location) {
        
		$scope.target = $location.search().pro_id;
		$http.get("url.properties")
		.then(function(response) {
				$http.get(response.data.productUrl + '/' + $scope.target)
				.then(function(response1){
						$scope.productDetail = response1.data;
    	
					});
			});
	});
        
