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
 	$http.get("gulgs.properties")
			.then(function(response) {
					$scope.shippingUrl = response.data.shippingUrl;
					$scope.customerUrl = response.data.customerUrl;
				});
 
 	$scope.send = function () {
 		
 		var updateShippingAddress={
					"firstName": $scope.firstName,
					"lastName": $scope.lastName,
					"address": $scope.streetAddress1,
					"city": $scope.city,
					"state": $scope.state,
					"zipcode": $scope.zip,
					"country": $scope.country
				};
 		
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
	

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
 	
 }]);
 
 
 