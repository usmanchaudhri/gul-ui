app.controller('accountCtrl',['$scope' , '$cookies','$location','$http','accountDetails','Base64','$routeParams', function($scope,$cookies,$location,$http,accountDetails,Base64,$routeParams) {
	
	if($cookies.get("username") != null){
				
				//$scope.getAccountDetail = orderList.orderDetail;
				//console.log("Date",$scope.getAccountDetail);	
					//console.log("In AccountCtrl:",accountDetails);	
				
					$scope.firstName = "abc";
					$scope.lastName = "abc";
					$scope.email = accountDetails.username;
					
				
			}else{
				$location.path("#/");
			}
	
	
	
	
	

	
}]);