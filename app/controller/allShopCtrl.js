app.controller('allShopCtrl',['$scope','$http','$q','$timeout','$location','$routeParams','allShopsList', function($scope,$http,$q,$timeout,$location,$routeParams,allShopsList) {
   
			$scope.fixPath = allShopsList.fixPath;
			$scope.token = allShopsList.token;
			$scope.allShopDetail	= allShopsList.allShopDetail;		
			/*$http.get("gulgs.properties")
			.then(function(response) {
			$scope.fixPath = response.data.fixImagePath;
			$scope.token = response.data.token;
			$http.get(response.data.shopUrl)
			.then(function(response1){
			$scope.allShopDetail = response1.data;
			});
			});*/
		
		}]);
        
