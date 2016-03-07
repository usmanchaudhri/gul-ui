 app.controller('loginCtrl',['$scope' , '$cookieStore' , function($scope,$cookieStore) {
		
			if(angular.isDefined($cookieStore.get("login"))){
				$scope.loginUser = $cookieStore.get("login");
			}else{
				$scope.loginUser = "login";
			}
			$scope.userLogout = function(){
				$cookieStore.remove("login");
				$scope.loginUser = "logout";
				console.log($scope.loginUser);
			};
			$scope.checkLogin = function(){
				if($scope.loginPass != '' && $scope.loginEmail != ''){
					$cookieStore.put("login",'login');
					$scope.loginUser = "login";
				}
				console.log("Check: "+$scope.loginUser);
				$scope.dismiss();
			};
		
		}]);
