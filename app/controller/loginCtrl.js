 app.controller('loginCtrl',['$scope' , '$cookies','$http','Base64','$location','$uibModal' , '$rootScope' ,function($scope,$cookies,$http,Base64, $location,$uibModal,$rootScope) {
		 
		   $scope.menuClass = true;
		   
		   
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			}
			 $rootScope.$on("signin", function(){
           $scope.signin();
        });
			
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
				if($cookies.get("username") != null){
					$cookies.remove("username");
					$scope.userFlag = false;
					
					$location.path("#/");
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
			
			
			/*
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
			*/
			$scope.showSignupError = false;
			$scope.showEmptyFieldError = false;
			//SignUp User
			
			//ENd of SignUp User
			
			
			//SignIn User
			if($cookies.get("username") != null){
				$scope.userFlag = true;	

				
			}else{
				$scope.userFlag = false;	
	
			}
			
			$scope.showError = false;
			
			
			
			//End of SignIn User
			
			
			//Signin Modal
			$scope.signingin = true;
			$scope.signin = function(){
		     
		    console.log("Singin"+$scope.signingin);
		   
		var modalInstance = $uibModal.open({
              templateUrl: 'loginModal.html',
              controller: 'loginModalCtrl'
               
      
         })
        .result.then(
        		function (userFlag){
        			$scope.userFlag = userFlag;
					/*if(getData.status == "login"){
						$scope.checkLogin(getData);		
					}else{
						$scope.regHeroku(getData);
					}*/
				}
        		
        		
        	
		);
		
		
			}
			/*End of Signin Modal*/
			
			
			/*var regUser = function(user){
				var data = $.param({
						Identity : user
					});
			
				$http.post(
					$scope.twilioUser,  data,config
				).success(function(data, status) {
						$scope.data = data;
						/*$cookies.put("userTwilio",data.sid);*/
						
					/*}).error(function (data, status) {
						console.log(data);
						
					});
			}*/
			/*var loadCchat = function(){
				$http.get($scope.customerUrl+"/"+$cookies.get("userData").id+"/cchat")
				.then(function(response1){
						console.log(response1);
					//	regUser($scope.loginEmail);
					});	
			}*/
		}]);
