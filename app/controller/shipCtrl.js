app.controller('shipCtrl',['$scope' , '$cookies','$location','$http','Base64','shippingList','$uibModal','$q' , function($scope,$cookies,$location,$http,Base64,shippingList,$uibModal,$q) {
			
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
			
			/*for(var i=0;i<=$scope.getShippingDetails.length;i++){
				if($scope.getShippingDetails[i].isActive == "y"){
					$scope.isActive =19;
					console.log("in for loop",$scope.getShippingDetails[i]);
				} */
				/*if($scope.getShippingDetails[i].isActive == "y"){
					$scope.isActive =$scope.getShippingDetails[i].id;
					console.log("in for loop",$scope.getShippingDetails[i]);
				}*/
			//console.log("Value",$scope.getShippingDetails[i]);
				
			
			
			//$scope.isActive = "10";
			
			$scope.isActive = "y";
			
	$scope.open = function(shippingDetail,position,flag){
				console.log("Getting User Shipping Address:",shippingDetail);
				console.log("Index of Shipping Detail:",position);
				var message = "";
				
				if($cookies.get("username") != null){
					$scope.animationsEnabled = true;
					$uibModal.open({
							templateUrl: 'myModalContent.html',
							controller: 'modalShipCtrl',
							    resolve: {
       								 updateDetail: function () {
							         var value = {
							         		"position": position,
							         		"shippingDetail": shippingDetail,
							         		"flag": flag
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
			
				
			
			$scope.isActiveChange = function(position){
				console.log("Object",position);
				var activePosition;
				// Removing Previous Default Shipping Address
				for(var i=0;i<$scope.getShippingDetails.length;i++){
					if($scope.getShippingDetails[i].isActive == "y"){
							$scope.updateIsActive($scope.getShippingDetails[i].id,"n",$scope.getShippingDetails[position].id,"y");
						//	$scope.getShippingDetails = getShippingList();
							
					} 
				}
				// Setting New Default Shipping Address
					
				/*for(var i=0;i<$scope.getShippingDetails.length;i++){
				console.log("Object",$scope.getShippingDetails[i]);
				console.log("isactive",$scope.getShippingDetails[i].isActive);
				if($scope.getShippingDetails[i].isActive == "y"){
					$scope.activePosition = i;
					console.log("in for loop",$scope.getShippingDetails[i]);
									//console.log("in for loop",$scope.getShippingDetails[i].isActive);
				} 
				}*/
				console.log("Exiting isActiveChangeFunction");

				
			};
			
			$scope.updateIsActive = function(shippingId1,isActive1,shippingId2,isActive2){
				console.log("Starting updateIsActive: ","Some Value");
				/*
				var mName = JSON.parse($cookies.get("username")).username.replace(/ /g, '');
				var mDesigner = $scope.shopCustomer.username.replace(/ /g, '');
				console.log("MNAME: "+mName);*/
				var data1 = {
					//"id":  shippingId1,
					"isActive": isActive1
				};
				console.log("Data1: ",data1);
				
				var data2 = {
					//"id":  shippingId2,
					"isActive": isActive2
				};
				console.log("Data2: ", data2);
				var base64 = Base64.encode( JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
				var loginAuth =  base64;
				
				var promise1 = $http({
						method: 'PUT',
						url: $scope.shippingUrl+'/'+shippingId1,
						data: data1,
						headers : {
							'Content-Type': 'application/json',
							'Authorization': 'Basic ' + loginAuth
						},
						cache: 'false'});
				var promise2 = $http({
						method: 'PUT',
						url: $scope.shippingUrl+'/'+shippingId2,
						data: data2,
						headers : {
							'Content-Type': 'application/json',
							'Authorization': 'Basic ' + loginAuth
						},
						cache: 'false'});

				$q.all([promise1,promise2]).then(function(data){
						console.log(data[0],data[1]);
						console.log("Success:",data[0] + data[1]);
						//$scope.getShippingDetails = data[1].data.customer.customerShipping;
						//$scope.isActive = "y";
					}, function onError(response) {
						console.log("onError",response);
						
					});
			};
			
			
			
	
	
		}]);