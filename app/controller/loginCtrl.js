 app.controller('loginCtrl',['$scope' , '$cookieStore','$http','Base64','$location' , function($scope,$cookieStore,$http,Base64, $location) {
		
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
		
		
			if(angular.isDefined($cookieStore.get("login"))){
				$scope.loginUser = $cookieStore.get("login");
			}else{
				$scope.loginUser = "login";
			}
	
	
			$scope.userLogout = function(){
				if($cookieStore.get($scope.loginEmail)!= null && $cookieStore.get($scope.loginPass)){
					$cookieStore.remove($scope.loginEmail);
					$cookieStore.remove($scope.loginPass);
					$scope.userFlag = false;
				}else{
					$scope.userFlag = true;
				}
				
				
				console.log("Email after logout"+$cookieStore.get($scope.loginEmail));
			};
	
			$scope.checkLogin = function(){
				/*if($scope.loginPass != '' && $scope.loginEmail != ''){
						$scope.siginInUser();					
				}else{
					$scope.userFlag = false;
				}*/
				$scope.dismiss();
				
				console.log("Check: "+$scope.loginEmail);
		
			};
			
			
			
			var checkUser = function(email){
				
				$http.get($scope.customerUrl)
				.then(function(response1){
						for(var i = 0;i< response1.data.length;i++){
							if(response1.data[i].email == email){
								$cookieStore.put("userData",response1.data[i]);
								console.log($cookieStore.get("userData"));
								
							}
						}
						console.log(response1);
						$scope.dismiss();
						
					});		

			}
			
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
					$scope.signupUrl,data11,config
				).success(function(data, status) {
						console.log(data);
						regUser($scope.regEmail);
						
					}).error(function (data, status) {
						console.log("Registration Data"+data);
						console.log(status);
					});
				
			}
			
			$scope.userFlag = false;
			
			$scope.siginInUser = function(){
				
				var base64 = Base64.encode( $scope.loginEmail + ':' + $scope.loginPass );

				var loginAuth =  base64;
				var config = {
					headers : {
						'Content-Type': 'application/json',
						'Authorization': 'Basic ' + loginAuth

					}
				}
				
				
				$http({withCredentials: true}).get(
					$scope.loginUrl,config
				).success(function(data, status) {
							console.log("Email when login"+$cookieStore.get("username"));
							
							/*$cookieStore.put("username",$scope.loginEmail);
							$cookieStore.put("password",$scope.loginPass);
							
							$scope.userFlag = true;
							console.log("Email when login"+$cookieStore.get("username"));
							console.log("Flag variable"+$scope.userFlag);*/
							
					}).error(function (data, status) {

						console.log("Login Data"+data);

					
						
						console.log(status);
						$scope.dismiss();
					});
			}
			
			
			
			
			var regUser = function(user){
				var data = $.param({
						Identity : user
					});
			
				$http.post(
					$scope.twilioUser,  data,config
				).success(function(data, status) {
						$scope.data = data;
						$cookieStore.put("userTwilio",data.sid);
						console.log(data.sid);
						$scope.dismiss();
					}).error(function (data, status) {
						console.log(data);
						$scope.dismiss();
					});
			}
			/*var loadCchat = function(){
				$http.get($scope.customerUrl+"/"+$cookieStore.get("userData").id+"/cchat")
				.then(function(response1){
						console.log(response1);
					//	regUser($scope.loginEmail);
					});	
			}*/
		}]);
