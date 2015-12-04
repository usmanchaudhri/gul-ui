app.controller('MenuCtrl', function($scope, $q, $http, $timeout) {
	
	
	var promise1 = $http({method: 'GET', url: 'https://gul-product-service.herokuapp.com:443/gul-product-service/product', cache: 'true'});
	var promise2 = $http({method: 'GET', url: 'https://gul-product-service.herokuapp.com/gul-product-service/category', cache: 'true'});
	var promise3 = $http({method: 'GET', url: 'https://gul-product-service.herokuapp.com/gul-product-service/shop', cache: 'true'});
		
		
		
		$q.all([promise1, promise2, promise3]).then(function(data){
			$scope.product = data[0].data;
			$scope.cat = data[1].data;
			$scope.shop = data[2].data;
		});
	
   
   
            }
        );
        
