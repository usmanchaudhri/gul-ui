 app.controller('chatCtrl', function($scope,$http,DataLoader, Base64,$cookieStore,$q) {
		
		$http.get("gulgs.properties")
		.then(function(response) {
			
				$scope.twilioUsername = response.data.twilioUsername;
				$scope.twilioAuth = response.data.twilioAuth;
				$scope.twilioUser = response.data.twilioUser;
				$scope.twilioChannel = response.data.twilioChannel;
			});
		
		$scope.prepareCall = function(){
			
			var base64 = Base64.encode( $scope.twilioUsername + ':' + $scope.twilioAuth );
			$http.defaults.headers.common['Authorization'] = 'Basic ' + base64;
		}
		$scope.regUser = function(user){
			$scope.prepareCall();
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
					$cookieStore.put("userTwilio",data.sid);
					console.log(data.sid);
				}).error(function (data, status) {
					console.log(data);
				});
		}
		
		$scope.createChannel = function(){
			$scope.prepareCall();
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			}
		
			var data1 = $.param({
					UniqueName : $scope.user+$scope.designer,
					Type: 'private'
				});			
			
			$http.post(
				$scope.twilioChannel,  data1,config
			).success(function(data, status) {
					$scope.data = data;
					$scope.channelSid = data.sid;
					console.log(data.sid);
					var data2 = $.param({
							Identity : $scope.user
						});
					var data1 = $.param({
							Identity : $scope.designer
						});
					var promise1 = $http({
							method: 'POST',
							url: $scope.twilioChannel+'/'+data.sid+'/Members',
							data: data2,
							headers : {
								'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
							},
							cache: 'true'});
					var promise2 = $http({
							method: 'POST',
							url: $scope.twilioChannel+'/'+data.sid+'/Members',
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
				
				
				}).error(function (data, status) {
					console.log(data);
				});
		}
			
		$scope.sendMessage = function(){
			$scope.prepareCall();
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			}
		
			var data1 = $.param({
					Body : $scope.msgBody,
					From : $scope.user
				});
				$scope.msgBody = "";
			$http.post(
				$scope.twilioChannel+'/'+$scope.channelSid+'/Messages',  data1,config
			).success(function(data, status) {
				console.log(data);
				
				}).error(function (data, status) {
					console.log(data);
				});
				
		}
		$scope.retrieveMessage = function(){
			$scope.prepareCall();
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			}
		
			$http.get(
				$scope.twilioChannel+'/'+$scope.channelSid+'/Messages',config
			).success(function(data, status) {
				$scope.retMsg = data;
				
				}).error(function (data, status) {
					console.log(data);
				});
				
		}
  
	});
