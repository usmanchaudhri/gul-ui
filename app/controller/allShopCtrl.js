app.controller('allShopCtrl',['$scope','$http','$q','$timeout','$location','$routeParams', function($scope,$http,$q,$timeout,$location,$routeParams) {
   
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.fixPath = response.data.fixImagePath;
					$scope.token = response.data.token;
					$http.get(response.data.shopUrl)
					.then(function(response1){
							//	$scope.shopLength = response1.data.products.categoty.subCategories.length;
							$scope.allShopDetail = response1.data;
						});
				});
		
		}]);
        
