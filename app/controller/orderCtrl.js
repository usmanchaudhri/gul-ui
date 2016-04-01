app.controller('orderCtrl',['$scope' , '$cookies','$location','$http','Base64','$routeParams','orderList' , function($scope,$cookies,$location,$http,Base64,$routeParams,orderList) {
	
	if($cookies.get("username") != null){
				
				$scope.getOrderDetail = orderList.orderDetail;
				
				
			}else{
				$location.path("#/");
			}
	
	
	
	
	

	
}]);