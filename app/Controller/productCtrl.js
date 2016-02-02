 app.controller('productCtrl',['$scope','$http','$routeParams' , function($scope,$http,$routeParams) {
		$scope.isNumber = angular.isNumber;
		$scope.shopTemp = [];
		$scope.records = [];
		$scope.infiniteList = [];
		$scope.incr = 1;
		$scope.sorting = 'pricingProduct.storedValue';

		// Make an API request
		$http.get("url.properties")
		.then(function(response) {
				$scope.fixPath = response.data.fixImagePath;
				$scope.token = response.data.token;
				$http.get(response.data.productUrl)
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
					});
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
		$scope.scrollTriggered = "";
    
    $scope.loadMore = function(){
      console.log("Load More");
      $scope.scrollTriggered += "\n Scroll Triggered" 
       if($scope.products.length > $scope.incr)
        for(var i = $scope.incr; i< ($scope.incr+2); i++){
            $scope.infiniteList.push($scope.products[i]);
        }
        $scope.incr= $scope.incr + 2 ;
        console.log("Load More" + $scope.infiniteList.length);
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
