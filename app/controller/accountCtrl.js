app.controller('accountCtrl',['$scope','accountDetails', function($scope,accountDetails) {

	/**
	 * Getting Name and info from Account Detail var and display to edit and update
	 */
				$scope.email = accountDetails.username;

}]);