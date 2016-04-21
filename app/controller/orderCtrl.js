app.controller('orderCtrl',['$scope' , '$cookies','$location','$http','Base64','$routeParams','orderList' , function($scope,$cookies,$location,$http,Base64,$routeParams,orderList) {
	
	if($cookies.get("username") != null){
				
				$scope.getOrderDetail = orderList.orderDetail;
				console.log("Date",$scope.getOrderDetail);	
					$scope.firstName = "abc";
					$scope.lastName = "abc";
					$scope.email = "abc";
					$scope.email = "abc";
					$scope.email = "abc";
					
				
			}else{
				$location.path("#/");
			}
	
	
	
	
	

	
}]);