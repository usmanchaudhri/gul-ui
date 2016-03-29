 app.controller('loginCtrl',['$scope' , '$cookieStore','$http' , function($scope,$cookieStore,$http) {
		
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			}
			
			$http.get("gulgs.properties")
			.then(function(response) {
			
					$scope.twilioUser = response.data.twilioUser;
					$scope.customerUrl = response.data.customerUrl;
					console.log("LOGIN Properties");
					
				});
		
		
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
					$cookieStore.put("username",$scope.loginEmail);
					$scope.loginUser = "login";
					checkUser($scope.loginEmail);
					
					
				}
				
				console.log("Check: "+$scope.loginUser);
		
			};
			
			
			var checkUser = function(email){
				
				$http.get($scope.customerUrl)
				.then(function(response1){
						for(var i = 0;i< response1.data.length;i++){
							if(response1.data[i].email == email){
								$cookieStore.put("userData",response1.data[i]);
								console.log($cookieStore.get("userData"));
								regUser($scope.loginEmail);
							}
						}
						console.log(response1);
						
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
		console.log("LOGIN CONTROL");
			/*var loadCchat = function(){
				$http.get($scope.customerUrl+"/"+$cookieStore.get("userData").id+"/cchat")
				.then(function(response1){
						console.log(response1);
					//	regUser($scope.loginEmail);
					});	
			}*/
		}]);
