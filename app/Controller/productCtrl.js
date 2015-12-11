 app.controller('productCtrl', function($scope,$http) {
        
		$http.get("url.properties")
		.then(function(response) {
				$http.get(response.data.productUrl)
				.then(function(response1){
						$scope.product = response1.data;
						$scope.size = response1.data.length;    	
					});
			});
		$scope.currentPage = 0;
		$scope.pageSize = 5;
		$scope.numberOfPages=function(){
			return Math.ceil($scope.size/$scope.pageSize);
		}
	});
        
app.filter('startFrom', function() {
		return function(input, start) {
			start = +start;
			return input.slice(start);
		}
	});