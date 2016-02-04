app.controller('shopCtrl', function($scope,$http,$q,$timeout,$location,$routeParams) {
   
		$scope.shop_id = $routeParams.shopId;
		$http.get("gulgs.properties")
		.then(function(response) {
				$scope.fixPath = response.data.fixImagePath;
				$scope.token = response.data.token;
				var promise1 = $http({method: 'GET', url: response.data.shopUrl+'/'+$scope.shop_id+'/products', cache: 'true'});
				var promise2 = $http({method: 'GET', url: response.data.shopUrl+'/'+$scope.shop_id+'/designers', cache: 'true'});
				$q.all([promise1, promise2]).then(function(data){
						$scope.shop = data[0].data;
						$scope.designer = data[1].data;
					});
			});
			
		
		$scope.currentPage = 1;
		$scope.pageSize = 9;
		$scope.pageChangeHandler = function(num) {
			console.log('meals page changed to ' + num);
		};
	});
        
