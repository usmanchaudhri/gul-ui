app.controller('loginCtrl', ['$scope', '$cookies', '$location', '$uibModal', '$rootScope','loginFactory', function ($scope, $cookies, $location, $uibModal, $rootScope,loginFactory) {

	$scope.menuClass = true;
	$scope.showSignupError = false;
	$scope.showEmptyFieldError = false;
	$scope.showError = false;
	$scope.signingin = true;

	if ($cookies.get("username") != null) {
		$scope.userFlag = true;
	} else {
		$scope.userFlag = false;
	}

	$scope.userLogout = function(){
		loginFactory.userLogout().then(function(data){
			if(!data){
				$scope.userFlag = data
				$location.path("#/");
			}

		});

				$location.path("#/");
			};

	$rootScope.$on("signin", function () {
		$scope.signin();
	});

	loginFactory.getUrls().then(function(response){
		$scope.twilioUser = response.data.twilioUser;
		$scope.customerUrl = response.data.customerUrl;
		$scope.signupUrl = response.data.signupUrl;
		$scope.loginUrl = response.data.loginUrl;

	});

	$scope.signin = function () {
		console.log("HELLO WORLD");
		var modalInstance = $uibModal.open({
					templateUrl: 'loginModal.html',
					controller: 'loginModalCtrl'
				})
				.result.then(
						function (userFlag) {
							$scope.userFlag = userFlag;
						}
				);
	}

}]);