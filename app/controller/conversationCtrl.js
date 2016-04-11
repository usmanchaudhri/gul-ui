
var chatCtrl = app.controller('conversationCtrl',['$scope','$http', 'Base64','$cookies','$q','$routeParams','$timeout','conList',function($scope,$http, Base64,$cookies,$q,$routeParams,$timeout,conList) {
		
			console.log("Checikkkkkkkk");
			//$scope.chatNames = chatList;
			$scope.chat_name = $routeParams.chatName;
			console.log("Converation CTRL: ",conList);
			$scope.retMsg = conList.chatData;
			$scope.msgTitle = conList.cchat;
			console.log("RET MSG:",$scope.retMsg);
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			$scope.mFrom = JSON.parse($cookies.get("username")).username.replace(/ /g, '');
			var mSender = JSON.parse($cookies.get("username")).username.split('@');
			$scope.sender = mSender[0];
			$http.get('gulgs.properties')
			.then(function(one) {
					console.log(one);
					$scope.twilioChannel = one.data.twilioChannel;
				});
			$scope.regUser = function(user){
				var data = $.param({
						Identity : user
					});
			
				$http.post(
					$scope.twilioUser,  data,config
				).success(function(data, status) {
						$scope.data = data;
						//$cookies.put("userTwilio",data.sid);
						console.log(data.sid);
					}).error(function (data, status) {
						console.log(data);
					});
			};
		
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
		
			//	var mUsername = $scope.mFrom.split('@');
				var data1 = $.param({
						Body : $scope.msgBody,
						From : $scope.mFrom
					});
				$scope.msgBody = "";
				$http.post(
					$scope.twilioChannel+'/'+$scope.chat_name+'/Messages',  data1,config
				).success(function(data, status) {
						console.log(data);
						$scope.retrieveMessage();
				
					}).error(function (data, status) {
						console.log(data);
					});
				
				
			};
	
			$scope.retrieveMessage = function(){
				console.log("Error");
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				}
		
				$http.get(
					$scope.twilioChannel+'/'+$scope.chat_name+'/Messages',config
							 ).success(function(data, status) {
							 	console.log("RET MESSAGE: " , data);
					var chatData = [];
													
													for(var i = 0;i<data.length ; i++){
														
														var from = data[i].from.split('@');
														var value = {
															"from": from[0],
															"body":	data[i].body
														}
														chatData.push(value);
														
													}
						$scope.retMsg = chatData;
						console.log(data);
				
					}).error(function (data, status) {
						console.log("Error");
						console.log(data);
					
					});
				
			};

			/*$scope.retrieveChannel = function(){
			var config = {
			headers : {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
			}
			}
			var mUnique = "";
			console.log($scope.chat_name);
			console.log("Length"+chatList.length);
				
			if(angular.isDefined($scope.chat_name)){
			for(var i =0;i < chatList.length;i++){
			console.log(chatList[i].name);
			if(chatList[i].name == $scope.chat_name){
			mUnique = $scope.chatArr[i].uniqueName;
			console.log(mUnique);
			}
			}
			}
			//	var mUnique = $cookies.get("username") + "-" + $scope.chat_name.replace(/ /g, '');
			$http.get(
			$scope.twilioChannel+'/'+mUnique,config
			).success(function(data, status) {
			$scope.channelSid = data.entity.sid;
				
			//	addMembers();
			$scope.retrieveMessage();
			console.log(data.entity.sid);
			}).error(function (data, status) {
			console.log(data);
			console.log("3rd");
			});
				
			};*/
		
			/*	var addMembers = function(){
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
			};
			*/
  
  
		}]);
