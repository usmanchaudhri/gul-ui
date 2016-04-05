 app.controller('loginModalCtrl',['$scope','$uibModalInstance', function($scope,$uibModalInstance) {
 	
	$scope.showSignUp = function(){
		$scope.signingin = false;
		console.log("modal signup:"+$scope.signingin);
	};

	$scope.showSignIn = function(){
		$scope.signingin = true;
		console.log("modal signin:"+$scope.signingin);
	};


	$scope.checkLogin = function (loginEmail,loginPass) {
		console.log("Modal EMail"+loginEmail+loginPass);
		var value = {
			"username": loginEmail,
			"password": loginPass
		}
 		$uibModalInstance.close(value);
  };
	
	$scope.regHeroku = function(regEmail,regPass){
		console.log("Reg Modal EMail"+loginEmail+loginPass);
		var value = {
			"regusername": regEmail,
			"regpassword": regPass
		}
 		$uibModalInstance.close(value);	
	
	};
	
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
 	
 }]);