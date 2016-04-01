app.controller('shipCtrl',['$scope' , '$cookies','$location','$http','Base64' , function($scope,$cookies,$location,$http,Base64) {
			
			if($cookies.get("username") != null){
				$scope.getShippingDetails = JSON.parse($cookies.get("username")).customerShipping;	
			}else{
				$location.path("#/");
			}
			
	
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.shippingUrl = response.data.shippingUrl;
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
						$scope.dismiss();
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
	
	
	
		}]);