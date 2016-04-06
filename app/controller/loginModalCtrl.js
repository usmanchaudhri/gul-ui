 app.controller('loginModalCtrl',['$scope','$uibModalInstance','$http','Base64','$cookies', function($scope,$uibModalInstance,$http,Base64,$cookies) {
 	
 	$scope.signingin = true;
 	$http.get("gulgs.properties")
			.then(function(response) {
			
					$scope.twilioUser = response.data.twilioUser;
					$scope.customerUrl = response.data.customerUrl;
					$scope.signupUrl = response.data.signupUrl;
					$scope.loginUrl = response.data.loginUrl;
					
					
				});
 	
 	
 	
 	
	$scope.showSignUp = function(){
		$scope.signingin = false;
		console.log("modal signup:"+$scope.signingin);
	};

	$scope.showSignIn = function(){
		$scope.signingin = true;
		console.log("modal signin:"+$scope.signingin);
	};


	$scope.checkLogin = function (loginEmail,loginPass) {
		$scope.siginInUser(loginEmail,loginPass);
		console.log("Modal EMail"+loginEmail+loginPass);
		
 		
  };
	
	$scope.registerUser = function(regEmail,regPass){
		$scope.regHeroku(regEmail,regPass);
		
 		
	
	};
	
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
 	
 	
 	/*User Signin*/
 	$scope.siginInUser = function(loginEmail,loginPass){
				
				$scope.loginEmail = loginEmail;
				$scope.loginPass  = loginPass;
				
				var base64 = Base64.encode( $scope.loginEmail + ':' + $scope.loginPass );

				var loginAuth =  base64;
				var config = {
					headers : {
						'Content-Type': 'application/json',
						'Authorization': 'Basic ' + loginAuth

					}
				}
				
				
				
				
				$http.get(
					$scope.loginUrl,config
				).success(function(data, status) {
						//	console.log("Data here",data);
							if($cookies.get("username") != $scope.loginEmail){
							$cookies.put("username",JSON.stringify(data));
							$cookies.put("password",$scope.loginPass);
							$cookies.put("userId",data.id);
						//	console.log(data);
							 var userFlag = true;	
							$uibModalInstance.close(userFlag);		
							}else{
						//		console.log($cookies.get("username")+"already exist!");
								$scope.userFlag = false;
							}
							
						//	console.log("Email when login"+$cookies.get("username"));
					//		console.log("Flag variable"+$scope.userFlag);
							
					}).error(function (data, status) {
						
						$scope.showError = true;
						console.log("Login Data"+data);
						$scope.userFlag = false;	
						
					});
			};
 	/*End of User Signin*/
 	
 	
 	/*User Signup*/
 	$scope.regHeroku = function(regEmail,regPass){
				$scope.regEmail = regEmail;
				$scope.regPass =  regPass;
				console.log("RegHeroku called:" + $scope.regEmail);
				var config = {
					headers : {
						'Content-Type': 'application/json'
					}
				}
				
				var data = {
					"username": $scope.regEmail,
					"password": $scope.regPass
				}
				$http.post(
					$scope.signupUrl,data,config
				).success(function(data, status) {
						console.log(data);
						$scope.loginEmail = $scope.regEmail;
						$scope.loginPass = $scope.regPass;
						regUser($scope.regEmail);
					$cookies.put("username",JSON.stringify(data));
							$cookies.put("password",$scope.loginPass);
							$cookies.put("userId",data.id);
					//	$scope.siginInUser();
						 var userFlag = true;	
						$uibModalInstance.close(userFlag);	
						
					}).error(function (data, status) {
						$scope.showSignupError = true;
						console.log("Registration Erro"+data);
						console.log(status);
					});
				
			}
			
			var regUser = function(user){
					var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			}
				
				var data = $.param({
						Identity : user
					});
			
				$http.post(
					$scope.twilioUser,  data,config
				).success(function(data, status) {
						$scope.data = data;
						/*$cookies.put("userTwilio",data.sid);*/
						
					}).error(function (data, status) {
						console.log(data);
						
					});
			}
 	/*End of User Signup*/
 }]);