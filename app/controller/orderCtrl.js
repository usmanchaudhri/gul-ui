app.controller('orderCtrl',['$scope' , '$cookies','$location','$http','Base64','$routeParams','orderList' , function($scope,$cookies,$location,$http,Base64,$routeParams,orderList) {
	
	if($cookies.get("username") != null){
				
				$scope.getOrderDetail = orderList.orderDetail;
				console.log("Date",$scope.getOrderDetail);			
				
			}else{
				$location.path("#/");
			}
	
	 $scope.dateValue = new Date(dateInMilliSeconds);
	
	
	

	
}]);