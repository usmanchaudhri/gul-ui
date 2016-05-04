 app.controller('modalCtrl',['$scope','$uibModalInstance','name', function($scope,$uibModalInstance,name) {
 	$scope.send = function (msg) {
    $uibModalInstance.close(msg);
  };
	
	$scope.productDetailName = name;
	//$scope.shippingDetail;

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
 	
 }]);
 
  app.controller('modalShipCtrl',['$scope','$uibModalInstance','updateDetail','$http','$cookies','Base64','$q', function($scope,$uibModalInstance,updateDetail,$http,$cookies,Base64,$q) {
 
  	$http.get("gulgs.properties")
			.then(function(response) {
			
					$scope.loginUrl = response.data.loginUrl;
				});
				
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
							//$scope.customerUrl+'/'+JSON.parse($cookies.get("username")).id+'/cchat',config
							$scope.loginUrl,config
						).then(function(data, status) {
							console.log("Shipping Detail",data);
							//console.log("Shipping Detail",data.data[0]);
							var getShippingDetails = data.data.customerShipping;
							 $uibModalInstance.close(getShippingDetails);
							});
					}).error(function (data, status) {
						console.log(data);
						console.log(status);
					});		
 		
  	
  };
  		
	var newShipping = function(){
			var isActiveValue="n";
			console.log("ShippingListSize",updateDetail.shippingListSize);
			if(updateDetail.shippingListSize==0){
				isActiveValue = "y";
			}
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
				$scope.shippingUrl, $scope.shippingData(isActiveValue),config
				).success(function(data, status) {
					console.log("Succesfully Added"+ data);
			$http.get(
				$scope.loginUrl,config
			).then(function(data, status) {
				console.log("Shipping Detail",data.data);
					var getShippingDetails = data.data.customerShipping;
					$uibModalInstance.close(getShippingDetails);
				});
			}).error(function (data, status) {
				console.log(data);
				console.log(status);
		 });  
	   }
		
		/*var newShipping = function(){
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
							console.log("Response",data);
							//var getShippingDetails = data.data.customer.customerShipping;
							//var getShippingDetails = getShippingList();
							getShippingList();
							console.log("ShippingList",$scope.shippingDetail);
							//$uibModalInstance.close($scope.shippingDetail);
					
							});
					}).error(function (data, status) {
						console.log(data);
						console.log(status);
					});		
			} */
			
			$scope.shippingData = function(isActiveValue){
				return allShippingData={
					"firstName": $scope.firstName,
					"lastName": $scope.lastName,
					"address": $scope.streetAddress1,
					"city": $scope.city,
					"state": $scope.state,
					"zipcode": $scope.zip,
					"country": $scope.country,
					"isActive":isActiveValue
				}
		
			}	
			/*var getShippingList = function(){
				var deferred = $q.defer();
					var promise = $http({
							method: 'GET',
							url: 'gulgs.properties',
							cache: 'false'});
					return promise
					.then(function(response) {
							var base64 = Base64.encode( JSON.parse($cookies.get("username")).username + ':' +JSON.parse($cookies.get("username")).password );
							var loginAuth =  base64;
							var config = {
								headers : {
									'Content-Type': 'application/json',
									'Authorization': 'Basic ' + loginAuth
								}
							}						
							return	$http.get(response.data.loginUrl , config)
							.then(function(response1){
									console.log("New ShippingList",response1.data.customerShipping);
									$scope.shippingDetail = response1.data.customerShipping;
									$uibModalInstance.close($scope.shippingDetail);
									return response1.data.customerShipping;
								});
			
						});
			} */
 	
 }]);
 
 
 