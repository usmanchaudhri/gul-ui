app.controller('shipCtrl',['$scope' , '$cookies','$location','$http','Base64','shippingList','$uibModal' , function($scope,$cookies,$location,$http,Base64,shippingList,$uibModal) {
			
			if($cookies.get("username") != null){
				$scope.getShippingDetails = shippingList;	
			}else{
				$location.path("#/");
			}
			
	
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.shippingUrl = response.data.shippingUrl;
					$scope.customerUrl = response.data.customerUrl;
				});
		
			
	
			$scope.newShipping = function(){
				var base64 = Base64.encode( JSON.parse($cookies.get("username")).username + ':' + $cookies.get("password") );
				console.log("username"+JSON.parse($cookies.get("username")).username + 'Password' + $cookies.get("password"));
				var loginAuth =  base64;
				var config = {
					headers : {
						'Content-Type': 'application/json',
						'Authorization': 'Basic ' + loginAuth
					}
				}
				console.log("Config"+loginAuth);
				$http.post(
					$scope.shippingUrl, $scope.shippingData(),config
				).success(function(data, status) {
						console.log("Succesfully Added"+ data);
						$http.get(
							$scope.customerUrl+'/'+JSON.parse($cookies.get("username")).id+'/cchat',config
						).then(function(data, status) {
							console.log("Shipping Detail",data.data[0]);
							$scope.getShippingDetails = data.data[0].customer.customerShipping;
								$scope.dismiss();
							});
					}).error(function (data, status) {
						console.log(data);
						console.log(status);
					});		
			}
			
			$scope.shippingData = function(){
				return allShippingData={
					"firstName": $scope.firstName,
					"lastName": $scope.lastName,
					"address": $scope.streetAddress1,
					"city": $scope.city,
					"state": $scope.state,
					"zipcode": $scope.zip,
					"country": $scope.country
				}
		
			}	
	
	$scope.open = function(shippingDetail,position){
				console.log("Getting User Shipping Address:",shippingDetail);
				console.log("Index of Shipping Detail:",position);
				
				if($cookies.get("username") != null){
					$scope.animationsEnabled = true;
					$uibModal.open({
							templateUrl: 'myModalContent.html',
							controller: 'modalShipCtrl',
							    resolve: {
       								 updateDetail: function () {
							         var value = {
							         		"position": position,
							         		"shippingDetail": shippingDetail
							         };
							         return value;
							    }
							}

						})
					.result.then(
						function (shippingDetail) {
							$scope.getShippingDetails = shippingDetail;
						}
            
					);
				}else{
					$rootScope.$emit("signin", {});
				}
			};
	
	
		}]);