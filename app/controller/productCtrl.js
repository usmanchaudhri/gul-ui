 app.controller('productCtrl',['$scope','$http','$routeParams' , function($scope,$http,$routeParams) {
			$scope.isNumber = angular.isNumber;
			$scope.shopTemp = [];
			$scope.records = [];
			$scope.infiniteList = [];
			$scope.incr = 1;
			$scope.busy =false;
			var first = 0;
			$scope.sorting = 'pricingProduct.storedValue';

			// Make an API request
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.fixPath = response.data.fixImagePath;
					$scope.token = response.data.token;
					$scope.productUrl = response.data.productUrl;
					/*$http.get(response.data.productUrl+"?first=1&max=10")
					.then(function(data) {
					$scope.products = data.data;
					angular.forEach(data.data, function(value, key){
					if(angular.isDefined(value.shop.id)){
					var shopVal = {
					id: value.shop.id,
					name: value.shop.name,
					};
					$scope.shopTemp.push(shopVal);
					}
					});
					});*/
				});
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
		
			$scope.loadMore = function(){
				if(angular.isDefined($scope.productUrl)){
					if ($scope.busy) return;
					$scope.busy = true;
					$http.get($scope.productUrl+"?first="+first+"&max=9")
					.then(function(data) {
							var products = data.data;
							angular.forEach(data.data, function(value, key){
									if(angular.isDefined(value.shop.id)){
										var shopVal = {
											id: value.shop.id,
											name: value.shop.name,
										};
										$scope.shopTemp.push(shopVal);
									}
								});
							for(var i = 0; i< products.length; i++){
								console.log("LENGTH: "+ $scope.infiniteList.length);
								$scope.infiniteList.push(products[i]);
								
							}
							$scope.busy = false;
							first = first + 9;
							
						});
					console.log("Load More");
					/*	if(angular.isDefined($scope.products)){
					if($scope.products.length > $scope.incr)
					for(var i = 0; i< $scope.products.length; i++){
					$scope.infiniteList.push($scope.products[i]);
					}
					}
        
					console.log("Load More" + $scope.infiniteList.length);
					*/
				}
			};
			$scope.load = function() {
 
				$('.carousel .item').each(function(e) {
						var bg_ = 'url(' + $(this).find('>img').attr('src') + ')';
						$(this).find('>img').hide();
						$(this).css('background-image', bg_);
					});
			};
			$scope.load();
		}]);
