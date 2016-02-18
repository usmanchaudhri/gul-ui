 app.controller('chatCtrl', function($scope,$http,DataLoader, Base64,$cookieStore,$q) {
		
		$http.get("gulgs.properties")
		.then(function(response) {
			
				$scope.twilioUsername = response.data.twilioUsername;
				$scope.twilioAuth = response.data.twilioAuth;
				$scope.twilioUser = response.data.twilioUser;
				$scope.twilioChannel = response.data.twilioChannel;
				//app.use(allowCrossDomain);
				$scope.createChannel();
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
					'Access-Control-Allow-Origin': 'http://www.ip-messaging.twilio.com',
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					
					
				}
			}
		
			var data1 = $.param({
					UniqueName : 'AmjadGulgs',
					Type: 'private'
				});			
			
			$http.post(
				$scope.twilioChannel,  data1,config
			).success(function(data, status) {
					$scope.data = data;
					$scope.channelLink = data.links.members;
					$scope.msgLink = data.links.messages;
					console.log(data.sid);
					var data2 = $.param({
							Identity : 'Amjad'
						});
					var data1 = $.param({
							Identity : 'Gulgs'
						});
					var promise1 = $http({
							method: 'POST',
							url: $scope.channelLink,
							data: data2,
							headers : {
								'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
							},
							cache: 'true'});
					var promise2 = $http({
							method: 'POST',
							url: $scope.channelLink,
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
				
				$scope.retrieveChannel();
				
					console.log("RET Channel");
				});
		}
			
		$scope.sendMessage = function(){
			/*if(angular.isUndefined($scope.channelLink)){
				
			$scope.retrieveChannel();
				
			}*/
			console.log('Called');
			$scope.prepareCall();
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
			$scope.prepareCall();
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
			$scope.prepareCall();
			console.log("Check");
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
					'Access-Control-Allow-Origin' : '*'
				}
			}
		
			$http.get(
				$scope.twilioChannel+'/AmjadGulgs',config
			).success(function(data, status) {
				$scope.channelLink = data.links.members;
				$scope.msgLink = data.links.messages;
				console.log("First");
				}).error(function (data, status) {
					console.log(data);
					console.log("3rd");
				});
				
		}
		/*
		var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
};*/
  
	});
