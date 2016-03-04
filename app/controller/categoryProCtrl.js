app.controller('categoryProCtrl',['$scope','$http','$q','$timeout','$location','$routeParams', function($scope,$http,$q,$timeout,$location,$routeParams) {
			$scope.cat_id = $routeParams.catId;
			$scope.categoryProDetail = [];
			$scope.categoryIDs = [];
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.fixPath = response.data.fixImagePath;
					$scope.token = response.data.token;
					$http.get(response.data.categoryUrl + '/' + $scope.cat_id + '/products')
					.then(function(response1){
							var data = response1.data.products;
							var dataLength = data.length;
					/*//		console.log(data.length);
						for(var i=0;i<dataLength;i++){
							console.log(data[i]);
							if(angular.isObject(data[i].shop)){
								var value = {
									"id": data[i].shop.id,
									"name": data[i].shop.name
								};
								$scope.categoryIDs.push(value);
								console.log(value);
							}
							
						}*/
							for(var i=0;i<dataLength;i++){
								var shopName = '';
								if(angular.isObject(data[i].shop)){
									shopName = data[i].shop.name;
								var value = {
									"id": data[i].shop.id,
									"name": data[i].shop.name
								};
								$scope.categoryIDs.push(value);
								console.log($scope.categoryIDs);
								}else{
									shopName = data[i].shop;
								
								}
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
									"shop": shopName,
									"productVariation": data[i].productVariation,
									"attributeDefinitions": data[i].attributeDefinitions,
									"imageInfo": data[i].imageInfo,
									"createdOn": data[i].createdOn
								};
								$scope.categoryProDetail.push(value);
								data = data[i].category.products;
							}
						});
				});
				 $scope.getShop = function(mName){
					console.log(mName);
					for(var i = 0;i < $scope.categoryIDs.length;i++){
						if(mName == $scope.categoryIDs[i].name){
							console.log("called");
							return $scope.categoryIDs[i].id;
						}
					}
					
				}
		}]);
        
