app.controller('accountCtrl','$location','$cookies','accountDetails',['$scope', function($scope,$location,$cookies,accountDetails) {

	/**
	 * Getting Name and info from Account Detail var and display to edit and update
	 */
	if($cookies.get("username") != null){
					$scope.email = accountDetails.username;
			}else{
				$location.path("#/");
			}
}]);