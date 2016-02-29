 app.controller('chatCtrl',['$scope','$http','DataLoader', 'Base64','$cookieStore','$q' ,function($scope,$http,DataLoader, Base64,$cookieStore,$q) {
		
		var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			}
		$http.get("gulgs.properties")
		.then(function(response) {
			
				$scope.twilioUsername = response.data.twilioUsername;
				$scope.twilioAuth = response.data.twilioAuth;
				$scope.twilioUser = response.data.twilioUser;
				$scope.twilioChannel = response.data.twilioChannel;
				$scope.twilio = response.data.twilio;
				$scope.createChannel();
			});
		
		
		$scope.regUser = function(user){
			var data = $.param({
					Identity : user
				});
			
			$http.post(
				$scope.twilioUser,  data,config
			).success(function(data, status) {
					$scope.data = data;
					$cookieStore.put("userTwilio",data.sid);
					console.log(data.sid);
				}).error(function (data, status) {
					console.log(data);
				});
		}
		
		$scope.createChannel = function(){
			var data1 = $.param({
					UniqueName : 'UzairAmjad',
					Type: 'private'
				});			
			
			$http.post(
				$scope.twilioChannel,  data1,config
			).success(function(data, status) {
				console.log(data);
				if(data == ''){
					$scope.retrieveChannel();
				}else{
					$scope.data = data;
					$scope.channelSid = data.sid;
					addMembers();
					
				}
					//console.log($scope.channelSid);
					
				
				
				}).error(function (data, status) {
				
				$scope.retrieveChannel();
				
					console.log("RET Channel");
				});
		}
			
		$scope.sendMessage = function(){
			/*if(angular.isUndefined($scope.channelLink)){
				
			$scope.retrieveChannel();
				
			}*/
			console.log('Called');
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			}
		
			var data1 = $.param({
					Body : $scope.msgBody,
					From : 'Amjad'
				});
				$scope.msgBody = "";
			$http.post(
				$scope.msgLink,  data1,config
			).success(function(data, status) {
				console.log(data);
				
				}).error(function (data, status) {
					console.log(data);
				});
				
		}
	
		$scope.retrieveMessage = function(){
			console.log("Error");
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			}
		
			$http.get(
				$scope.msgLink,config
			).success(function(data, status) {
				$scope.retMsg = data;
				console.log(data);
				
				}).error(function (data, status) {
					console.log("Error");
					console.log(data);
					
				});
				
		};

		$scope.retrieveChannel = function(){
			console.log("Check");
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
				}
			}
		
			$http.get(
				$scope.twilioChannel+'/UzairAmjad',config
			).success(function(data, status) {
				$scope.channelSid = data.sid;
				addMembers();
				console.log(data.sid);
				}).error(function (data, status) {
					console.log(data);
					console.log("3rd");
				});
				
		}
		var addMembers = function(){
			var data2 = $.param({
							Identity : 'Amjad'
						});
					var data1 = $.param({
							Identity : 'Uzair'
						});
					var promise1 = $http({
							method: 'POST',
							url: $scope.twilio+$scope.channelSid+'/Members',
							data: data2,
							headers : {
								'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
							},
							cache: 'true'});
					var promise2 = $http({
							method: 'POST',
							url: $scope.twilio+$scope.channelSid+'/Members',
							data: data1,
							headers : {
								'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
							},
							cache: 'true'});

					$q.all([promise1,promise2]).then(function(data){
							console.log(data[0],data[1]);
						}, function onError(response) {
							console.log(response);
						});
		}
	
  
	}]);
