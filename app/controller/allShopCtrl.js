app.controller('allShopCtrl', function($scope,$http,$q,$timeout,$location,$routeParams) {
   
		$http.get("url.properties")
		.then(function(response) {
				$scope.fixPath = response.data.fixImagePath;
				$scope.token = response.data.token;
				$http.get(response.data.shopUrl)
				.then(function(response1){
					//	$scope.shopLength = response1.data.products.categoty.subCategories.length;
						$scope.allShopDetail = response1.data;
					});
			});
		$scope.currentPage = 1;
		$scope.pageSize = 12;
		$scope.pageChangeHandler = function(num) {
			console.log('meals page changed to ' + num);
		};
	});
        
