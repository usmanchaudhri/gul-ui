 
var chatCtrl =  app.controller('chatCtrl',['$scope','$http', 'Base64','$cookies','$q','$routeParams','$timeout','chatList',function($scope,$http, Base64,$cookies,$q,$routeParams,$timeout,chatList) {
		
			console.log("Checikkkkkkkk");
			//$scope.chatNames = chatList;
			$scope.chat_name = $routeParams.chatName;
			$scope.chatNames = chatList;
					$cookies.put("chatlist",chatList);
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
		
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
		
				var	mFrom = $cookies.get("username").replace(/ /g, '');
				var data1 = $.param({
						Body : $scope.msgBody,
						From : mFrom
					});
				$scope.msgBody = "";
				$http.post(
					$scope.twilioChannel+'/'+$scope.channelSid+'/Messages',  data1,config
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
					$scope.twilioChannel+'/'+$scope.channelSid+'/Messages',config
				).success(function(data, status) {
						$scope.retMsg = data;
						console.log(data);
				
					}).error(function (data, status) {
						console.log("Error");
						console.log(data);
					
					});
				
			};

			$scope.retrieveChannel = function(){
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
				
			};
		
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
			};

/*	var d = new Date(1460446637257);
	var curr_date = d.getDate();
	var curr_month = d.getMonth() + 1; //Months are zero based
	var curr_year = d.getFullYear();
	console.log(curr_date + "-" + curr_month + "-" + curr_year);*/
  
		}]);
