app.controller('categoryProCtrl',['$scope','$http','$q','$timeout','$location','$routeParams', function($scope,$http,$q,$timeout,$location,$routeParams) {
   
		$scope.cat_id = $routeParams.catId;
		$scope.categoryProDetail = [];
		$http.get("gulgs.properties")
		.then(function(response) {
				$scope.fixPath = response.data.fixImagePath;
				$scope.token = response.data.token;
				$http.get(response.data.categoryUrl + '/' + $scope.cat_id + '/products')
				.then(function(response1){
						
						var data = response1.data.products;
						var dataLength = data.length;
						console.log(data.length);
						for(var i=0;i<dataLength;i++){
							var value = {
								"name": data[i].name,
								"id": data[i].id,
								"shortDesc": data[i].shortDesc,
								"longDesc": data[i].longDesc,
								"quantity": data[i].quantity,
								"pricingProduct": data[i].pricingProduct,
								"category": {
									"id": data[i].category.id,
									"code": data[i].category.code,
									"name": data[i].category.name,
									"createdOn": data[i].category.createdOn,
								},
								"shop": data[i].shop,
								"productVariation": data[i].productVariation,
								"attributeDefinitions": data[i].attributeDefinitions,
								"imageInfo": data[i].imageInfo,
								"createdOn": data[i].createdOn
							};
							console.log("Value");
							console.log(value);
							$scope.categoryProDetail.push(value);
							data = data[i].category.products;
						}
					});
			});
		$scope.currentPage = 1;
		$scope.pageSize = 9;
		$scope.pageChangeHandler = function(num) {
			console.log('meals page changed to ' + num);
		};
			
			
	}]);
        
