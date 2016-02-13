app.controller('MenuCtrl', function($scope, $q, $http, $timeout,breadcrumbs) {
	 $scope.breadcrumbs = breadcrumbs;
		$http.get("gulgs.properties")
		.then(function(response) {
				var promise1 = $http({method: 'GET', url: response.data.categoryUrl, cache: 'true'});
				var promise2 = $http({method: 'GET', url: response.data.shopUrl, cache: 'true'});
				$q.all([promise1, promise2]).then(function(data){
						$scope.cat = data[0].data;
						$scope.shop = data[1].data;
					});
			}
		);
		
		$scope.checkLength = function(cat){
				return cat.length;
				//console.log(cat.length);
			}
        
	});