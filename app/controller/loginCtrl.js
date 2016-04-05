 app.controller('loginCtrl',['$scope' , '$cookies','$http','Base64','$location','$uibModal' , function($scope,$cookies,$http,Base64, $location,$uibModal) {
		 
		   
		   
		   
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			}
			
			$http.get("gulgs.properties")
			.then(function(response) {
			
					$scope.twilioUser = response.data.twilioUser;
					$scope.customerUrl = response.data.customerUrl;
					$scope.signupUrl = response.data.signupUrl;
					$scope.loginUrl = response.data.loginUrl;
					
					
				});
		
		
			if(angular.isDefined($cookies.get("login"))){
				$scope.loginUser = $cookies.get("login");
			}else{
				$scope.loginUser = "login";
			}
	
	
			$scope.userLogout = function(){
				if($cookies.get("username")!= null && $cookies.get("password")!= null){
					$cookies.remove("username");
					$cookies.remove("password");
					
					$scope.userFlag = false;
					
					console.log("user Logged out!"+$cookies.get("username"));
				}else{
					$scope.userFlag = true;
				}
				
				
				console.log("Email after logout"+$cookies.get("username"));
			};
	
			$scope.checkLogin = function(loginUserData){
				  console.log("method called check login");
				if( loginUserData.username != '' && loginUserData.password != ''){
						$scope.loginEmail = loginUserData.username;
						$scope.loginPass = loginUserData.password;
						$scope.siginInUser();					
				}else{
					$scope.userFlag = false;
				}
			
				
				console.log("Check Login: "+$scope.loginEmail);
		
			};
			
			
			
			var checkUser = function(email){
				
				$http.get($scope.customerUrl)
				.then(function(response1){
						for(var i = 0;i< response1.data.length;i++){
							if(response1.data[i].email == email){
								$cookies.put("userData",response1.data[i]);
								console.log($cookies.get("userData"));
								
							}
						}
						console.log(response1);
						$scope.dismiss();
						
					});		

			}
			
			$scope.showSignupError = false;
			
			/*SignUp User*/
			$scope.regHeroku = function(){
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
						$scope.siginInUser();
						
					}).error(function (data, status) {
						$scope.showSignupError = true;
						console.log("Registration Erro"+data);
						console.log(status);
					});
				
			}
			/*ENd of SignUp User*/
			
			
			/*SignIn User*/
			if($cookies.get("username") != null){
				$scope.userFlag = true;	
				console.log("User Logged in:"+$cookies.get("username"));
			}else{
				$scope.userFlag = false;	
				console.log("User Logged out:"+ $cookies.get("username"));
			}
			
			$scope.showError = false;
			
			$scope.siginInUser = function(){
				
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
							console.log("Data here",data);
							if($cookies.get("username") != $scope.loginEmail){
							$cookies.put("username",JSON.stringify(data));
							$cookies.put("password",$scope.loginPass);
							$cookies.put("userId",data.id);
							console.log(data);
							$scope.userFlag = true;	
								
							}else{
								console.log($cookies.get("username")+"already exist!");
								$scope.userFlag = false;
							}
							
							console.log("Email when login"+$cookies.get("username"));
							console.log("Flag variable"+$scope.userFlag);
							
					}).error(function (data, status) {
						
						$scope.showError = true;
						console.log("Login Data"+data);
						
					});
			}
			
			/*End of SignIn User*/
			
			
			/*Signin Modal*/
			$scope.signingin = true;
			$scope.signin = function(){
		     
		    console.log("Singin"+$scope.signingin);
		   
		var modalInstance = $uibModal.open({
              templateUrl: 'loginModal.html',
              controller: 'loginModalCtrl'
               
      
         })
        .result.then(
        	function (loginUserData){
				$scope.checkLogin(loginUserData);
 			
             
			}
        	
		);
		
		
			}
			/*End of Signin Modal*/
			
			
			var regUser = function(user){
				var data = $.param({
						Identity : user
					});
			
				$http.post(
					$scope.twilioUser,  data,config
				).success(function(data, status) {
						$scope.data = data;
						/*$cookies.put("userTwilio",data.sid);*/
						$scope.dismiss();
					}).error(function (data, status) {
						console.log(data);
						$scope.dismiss();
					});
			}
			/*var loadCchat = function(){
				$http.get($scope.customerUrl+"/"+$cookies.get("userData").id+"/cchat")
				.then(function(response1){
						console.log(response1);
					//	regUser($scope.loginEmail);
					});	
			}*/
		}]);
