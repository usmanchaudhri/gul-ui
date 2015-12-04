 app.controller('Ctrl1', function($scope,$http,$q,$timeout,$location) {
        
        $scope.target = $location.search().target;
 		
		var promise3 = $http({method: 'GET', url: 'https://gul-product-service.herokuapp.com/gul-product-service/shop/'+$scope.target, cache: 'true'});
		
		
		
		$q.all([promise3]).then(function(data){
			$scope.designerProducts = data[0];
		});
	
   
   
            }
        );
        
