app.controller('thankuCtrl',['$scope','$cookieStore','$http','$window','$location','$rootScope', function($scope,$cookieStore,$http,$window,$location,$rootScope) {
			$scope.isNumber = angular.isNumber;
			$scope.totalPrice = 0;
			$scope.qty = 0;
		
			
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.paypalPaymentUrl = response.data.paypalPayment;
					checkUrl();
			
			});
			
			
			
			var checkUrl = function(){
				var urlParameters = $location.search();
				console.log($location.search());
				if(angular.isDefined(urlParameters.paymentId)){
					var tokenID = $cookieStore.get("tokenID");
					console.log(tokenID);
					$cookieStore.remove("tokenID");
					var config = {
						headers : {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tokenID
							
						}
					};
				
					console.log("PAYER ID: "+urlParameters.PayerID);
					var data = {
						"payer_id" : urlParameters.PayerID
					}
					$http.post(
						$scope.paypalPaymentUrl+'/'+urlParameters.paymentId+'/execute/',  data,config
					).success(function(data, status) {
						 $scope.uploadOrder();
							console.log(data);
					
						}).error(function (data, status) {
							console.log(data);
						});
				}
			};
				$scope.uploadOrder=function(){
				//console.log("CONSOLEEE");
				var count = -1;
				var config = {
					headers : {
						'Content-Type': 'application/json'
					}
				}
				//	console.log($scope.proUpload());
			$scope.items = $cookieStore.get("invoices",$scope.invoices);
				for(var i = 0;i<$scope.items.length;i++){
			
					$http.post(
						$scope.orderUrl, $scope.orderPayload($scope.items[i]),config
					).success(function(data, status) {
							console.log(data);
							$scope.newProId = data.id;
									 $location.path("#/");
						}).error(function (data, status) {
							console.log(data);
							console.log(status);
						});
				}
			};
		
			$scope.orderPayload = function(itemDetail){
				
				return payload ={
					"productId": itemDetail.id,
					"productName": itemDetail.name,
					"productSku": "Birds Han",
					"productQuantity": itemDetail.qty,
					"productPrice": itemDetail.cost,
					"productImagePath": "/listing",
					"productCategoryId": itemDetail.category.id,
					"productShopId": itemDetail.shopID,
					"customer": {
						"id": "4"
					}
				}
			}
		
		}]);
        

