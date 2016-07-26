app.controller('conversationCtrl', ['$scope', '$routeParams', '$cookies' , 'conList','chatServices', function ($scope,  $routeParams, $cookies ,conList ,chatServices) {
	$scope.chat_name = $routeParams.chatName;
	$scope.retMsg = conList.chatData;
	$scope.msgTitle = conList.cchat;
	$scope.mFrom = JSON.parse($cookies.get("username")).username.replace(/ /g, '');
	var mSender = JSON.parse($cookies.get("username")).username.split('@');
	$scope.sender = mSender[0];

	$scope.registerUser = function (user) {
		chatServices.registerUserOnTwilio(user).then(function (response) {

		});
	};

	$scope.sendMessage = function () {
		var msg = $scope.msgBody;
		$scope.msgBody = "";
		chatServices.sendMessageTwilio(msg, $scope.chat_name).then(function (response) {
			$scope.retMsg = response.chatData;

		});
	};

	$scope.retrieveMessage = function () {
		chatServices.retrieveMessageTwilio($scope.chat_name).then(function (response) {
			$scope.retMsg = response;
		});
	};

}]);