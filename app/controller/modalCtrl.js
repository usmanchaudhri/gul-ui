 app.controller('modalCtrl',['$scope','$uibModalInstance','name', function($scope,$uibModalInstance,name) {
 	$scope.send = function (msg) {
    $uibModalInstance.close(msg);
  };
	
	$scope.productDetailName = name;

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
 	
 }]);
 
  app.controller('modalShipCtrl',['$scope','$uibModalInstance','updateDetail','$http','$cookies','Base64', function($scope,$uibModalInstance,updateDetail,$http,$cookies,Base64) {
 
 
 $scope.firstName = updateDetail.shippingDetail.firstName;
 $scope.lastName = updateDetail.shippingDetail.lastName;
 $scope.streetAddress1 = updateDetail.shippingDetail.address;
 $scope.city = updateDetail.shippingDetail.city;
 $scope.state = updateDetail.shippingDetail.state;
 $scope.zip = updateDetail.shippingDetail.zipcode;
 $scope.country = updateDetail.shippingDetail.country;
 
 
 
 
 if(updateDetail.flag == 0){
					$scope.updateMessage = "Add New Address"
					$scope.submitButtonText = "Create Shipping Address";
				}else{
					$scope.updateMessage = "Update Shipping Address";
					$scope.submitButtonText = "Update Shipping Address";
					
				}
 	$http.get("gulgs.properties")
			.then(function(response) {
					$scope.shippingUrl = response.data.shippingUrl;
					$scope.customerUrl = response.data.customerUrl;
				});
 
 	$scope.send = function () {
 		
 		if(updateDetail.flag == 0){
			newShipping();
		}else{
			updateShippingInfo();
		}
 		
   
  };
	

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
  var updateShippingInfo = function(){
  	var updateShippingAddress={
					"firstName": $scope.firstName,
					"lastName": $scope.lastName,
					"address": $scope.streetAddress1,
					"city": $scope.city,
					"state": $scope.state,
					"zipcode": $scope.zip,
					"country": $scope.country
				};
 		
 		var base64 = Base64.encode( JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password );
				console.log("username"+JSON.parse($cookies.get("username")).username + 'Password' + JSON.parse($cookies.get("username")).password);
				var loginAuth =  base64;
				var config = {
					headers : {
						'Content-Type': 'application/json',
						'Authorization': 'Basic ' + loginAuth
					}
				}
				console.log("Config"+loginAuth);
				$http.put(
					$scope.shippingUrl+'/'+updateDetail.shippingDetail.id, updateShippingAddress,config
				).success(function(data, status) {
						console.log("Succesfully Added"+ data);
						$http.get(
							$scope.customerUrl+'/'+JSON.parse($cookies.get("username")).id+'/cchat',config
						).then(function(data, status) {
							console.log("Shipping Detail",data.data[0]);
							var getShippingDetails = data.data[0].customer.customerShipping;
							 $uibModalInstance.close(getShippingDetails);
							});
					}).error(function (data, status) {
						console.log(data);
						console.log(status);
					});		
 		
  	
  };
  		var newShipping = function(){
				var base64 = Base64.encode( JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password );
				console.log("username"+JSON.parse($cookies.get("username")).username + 'Password' + JSON.parse($cookies.get("username")).password);
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
							console.log("Shipping Detail",data.data.customer);
							var getShippingDetails = data.data.customer.customerShipping;
							$uibModalInstance.close(getShippingDetails);
					
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
					"isActive": "n",
					"zipcode": $scope.zip,
					"country": $scope.country
				}
		
			}	
 	
 }]);
 
 
 