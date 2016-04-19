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
	
	
		}]);