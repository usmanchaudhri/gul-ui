app.controller('shipCtrl',['$scope' , '$cookies','$location','$http','Base64','shippingList' , function($scope,$cookies,$location,$http,Base64,shippingList) {
			
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
	
	$scope.open = function(name){
		
				if($cookies.get("username") != null){
					$scope.animationsEnabled = true;
					$uibModal.open({
							templateUrl: 'myModalContent.html',
							controller: 'modalCtrl', 
							resolve: {
								name: function () {
									return name;
								}
							}
						})
					.result.then(
						function (msg) {
							$scope.sendMessage(msg);
						}
            
					);
				}else{
					$rootScope.$emit("signin", {});
				}
			};
	
	
		}]);