app.controller('newShopCtrl',['$scope','$http','$q','$timeout','$location','$routeParams', function($scope,$http,$q,$timeout,$location,$routeParams) {
   
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.fixPath = response.data.fixImagePath;
					$scope.token = response.data.token;
					$http.get(response.data.shopUrl)
					.then(function(response1){
							$scope.allShopDetail = response1.data;
						});
				});
		
		}]);
        
