 app.controller('productCtrl',['$scope','$http','$routeParams' , function($scope,$http,$routeParams) {
			/*$scope.isNumber = angular.isNumber;
			$scope.shopTemp = [];
			$scope.records = [];
			$scope.infiniteList = [];
			$scope.incr = 1;
			$scope.busy =false;
			var first = 0;
			$scope.sorting = 'price';

			// Make an API request
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.fixPath = response.data.fixImagePath;
					$scope.token = response.data.token;
					$scope.productUrl = response.data.productUrl;
					$scope.busy = true;
					$http.get($scope.productUrl+"?first="+first+"&max=9")
					.then(function(data) {
							var shopID = -1;
							var shopName = '';
							var products = data.data;
							for(var i = 0; i< products.length; i++){
								if(angular.isDefined(products[i].shop.id)){
									var shopVal = {
										id: products[i].shop.id,
										name: products[i].shop.name,
									};
									$scope.shopTemp.push(shopVal);
									shopID = products[i].shop.id;
									shopName = products[i].shop.name;
								}else{
									shopID = $scope.getShop(products[i].shop);
									shopName = products[i].shop;
								}
								console.log("LENGTH: "+ $scope.infiniteList.length);
								var value = {
									'shop': {
										'id': shopID,
										'name': shopName
									},
									'id': products[i].id,
									'name': products[i].name,
									'quantity': products[i].quantity,
									'pricingProduct':{
										'storedValue': products[i].pricingProduct.storedValue
									},
									'imagePath': products[i].imageInfo.imagePath,
									'prodCat': products[i].category.id,
									'prodVar': products[i].productVariation
									
								}
								console.log(products[i].productVariation);
								
								$scope.infiniteList.push(value);
								
							}
							$scope.busy = false;
							first = first + 9;
							
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
		
			$scope.loadMore = function(){
				if(angular.isDefined($scope.productUrl)){
					if ($scope.busy) return;
					$scope.busy = true;
					$http.get($scope.productUrl+"?first="+first+"&max=9")
					.then(function(data) {
							if(data.data.length>0){
								var shopID = -1;
								var shopName = '';
								var products = data.data;
								for(var i = 0; i< products.length; i++){
									if(angular.isDefined(products[i].shop.id)){
										var shopVal = {
											id: products[i].shop.id,
											name: products[i].shop.name,
										};
										$scope.shopTemp.push(shopVal);
										shopID = products[i].shop.id;
										shopName = products[i].shop.name;
									}else{
										shopID = $scope.getShop(products[i].shop);
										shopName = products[i].shop;
									}
									console.log("LENGTH: "+ $scope.infiniteList.length);
									var value = {
										'shop': {
											'id': shopID,
											'name': shopName
										},
										'id': products[i].id,
										'name': products[i].name,
										'quantity': products[i].quantity,
										'price': products[i].pricingProduct.storedValue,
										'imagePath': products[i].imageInfo.imagePath,
										'prodCat': products[i].category.id,
										'prodVar': products[i].productVariation
									
									}
								
									$scope.infiniteList.push(value);
								
								}
								$scope.busy = false;
								first = first + 9;
							}
						});
					console.log("Load More");
				}
			};
		*/
			$scope.load = function() {
				$("#filter-dropdown").click(function(){
						/*$(".home-filter").addClass("homepage-filter");*/
						if ( $( "#price-filters" ).is( ":hidden" ) ) {
							$( "#price-filters" ).slideDown( "slow" );
						
						} else {
							$( "#price-filters" ).slideUp("slow");
							/*$(".home-filter").removeClass("homepage-filter");*/
						}
					});
				$('.carousel').carousel(); 		
	 
				/*jQuery('.carousel .item').each(function(e) {
				var bg_ = 'url(' + $(this).find('>img').attr('src') + ')';
				jQuery(this).find('>img').hide();
				jQuery(this).css('background-image', bg_);
				});*/
				
			};
			$scope.load();
		}]);
