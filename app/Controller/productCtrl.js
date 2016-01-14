 app.controller('productCtrl', function($scope,$http,$cookieStore) {
		$scope.isNumber = angular.isNumber;
		$http.get("url.properties")
		.then(function(response) {
			$scope.fixPath = response.data.fixImagePath;
			$scope.token = response.data.token;
				
				$http.get(response.data.productUrl)
				.then(function(response1){
						$scope.product = response1.data;
						$scope.size = response1.data.length;    	
					});
			});
		$scope.currentPage = 1;
		$scope.pageSize = 9;
		$scope.pageChangeHandler = function(num) {
			console.log('meals page changed to ' + num);
		};
	


		
		$scope.load = function() {
 
			$('.carousel .item').each(function(e) {
					var bg_ = 'url(' + $(this).find('>img').attr('src') + ')';
					$(this).find('>img').hide();
					$(this).css('background-image', bg_);
				});
		};
		$scope.load();
	});
