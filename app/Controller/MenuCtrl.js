app.controller('MenuCtrl', function($scope, $q, $http, $timeout) {
		$http.get("url.properties")
		.then(function(response) {
				var promise1 = $http({method: 'GET', url: response.data.productUrl, cache: 'true'});
				var promise2 = $http({method: 'GET', url: response.data.categoryUrl, cache: 'true'});
				var promise3 = $http({method: 'GET', url: response.data.shopUrl, cache: 'true'});
				$q.all([promise1, promise2, promise3]).then(function(data){
						$scope.product = data[0].data;
						$scope.cat = data[1].data;
						$scope.shop = data[2].data;
					});
			}
		);
        
	});