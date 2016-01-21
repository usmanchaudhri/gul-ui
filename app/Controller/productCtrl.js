 app.controller('productCtrl', function($scope,$http,$cookieStore,$routeParams) {
		$scope.isNumber = angular.isNumber;
		/*$http.get("url.properties")
		.then(function(response) {
		$scope.fixPath = response.data.fixImagePath;
		$scope.token = response.data.token;
				
		$http.get(response.data.productUrl)
		.then(function(response1){
		$scope.product = response1.data;
		$scope.size = response1.data.length;    	
		});
		});*/
		$scope.shopTemp = [];
		function load(page) {
			var params     = { page: page},
			isTerminal = $scope.pagination &&
			$scope.pagination.current_page >= $scope.pagination.total_pages &&
			$scope.pagination.current_page <= 1;

			// Determine if there is a need to load a new page
			if (!isTerminal) {
				// Flag loading as started
				$scope.loading = true;

				// Make an API request
        
			
				$http.get("url.properties")
				.then(function(response) {
						$scope.fixPath = response.data.fixImagePath;
						$scope.token = response.data.token;
						$http.get(response.data.productUrl, params)
						.success(function(data, status, headers) {
							
								angular.forEach(data, function(value, key){
										if(angular.isDefined(value.shop.id)){
											var shopVal = {
												id: value.shop.id,
												name: value.shop.name,
											};
											$scope.shopTemp.push(shopVal);
										}
									});
								// Parse pagination data from the response header
								$scope.pagination = angular.fromJson(headers('x-pagination'));

								// Create an array if not already created
								$scope.items = $scope.items || [];

								// Append new items (or prepend if loading previous pages)
								if($scope.items.length == 0){
										
									
									$scope.items.push.apply($scope.items, data);
								}
							}).finally(function() {
								// Flag loading as complete
								$scope.loading = false;
							});
					});
			}
          
			
		}

		// Register event handler
		$scope.$on('endlessScroll:next', function() {
				// Determine which page to load
				var page = $scope.pagination ? $scope.pagination.current_page + 1 : 1;
				// Load page
				load(page);
			});

		// Load initial page (first page or from query param)
		load($routeParams.page ? parseInt($routeParams.page, 10) : 1);
		
		
		$scope.getShop = function(shopName){
			var tempId = 0;
			angular.forEach($scope.shopTemp, function(value, key){
				
										if( shopName  == value.name){
											tempId = value.id;
											return;
										}
									});
	
			return tempId;
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
