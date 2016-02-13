app.controller('singleCatCtrl', function($scope,$http,$q,$timeout,$location,$routeParams) {
   
		$scope.cat_id = $routeParams.catId;
		$scope.categoryProDetail = [];
		$http.get("gulgs.properties")
		.then(function(response) {
				$scope.fixPath = response.data.fixImagePath;
				$scope.token = response.data.token;
				$http.get(response.data.categoryUrl + '/' + $scope.cat_id + '/products')
				.then(function(response1){
						
						console.log(reponse1.data.products.length);
						/*for(var i=0;i<response1.data.products.length;i++){
						}*/
						
						
						
						
						
					});
			});
		$scope.currentPage = 1;
		$scope.pageSize = 9;
		$scope.pageChangeHandler = function(num) {
			console.log('meals page changed to ' + num);
		};
			
			
	});
        
