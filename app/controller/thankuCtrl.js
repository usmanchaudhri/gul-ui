app.controller('thankuCtrl',['$scope','$cookieStore','$http','$window','$location', function($scope,$cookieStore,$http,$window,$location) {
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
						 $rootScope.$emit("CallParentMethod", {});
							console.log(data);
					
						}).error(function (data, status) {
							console.log(data);
						});
				}
			};
		
		}]);
        

