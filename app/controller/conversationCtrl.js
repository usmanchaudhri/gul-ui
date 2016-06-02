app.controller('conversationCtrl', ['$scope', '$routeParams', '$cookies' , 'conList','gulServiceCall', function ($scope,  $routeParams, $cookies ,conList ,gulServiceCall) {
	$scope.chat_name = $routeParams.chatName;
	$scope.retMsg = conList.chatData;
	$scope.msgTitle = conList.cchat;

	$scope.mFrom = JSON.parse($cookies.get("username")).username.replace(/ /g, '');
	var mSender = JSON.parse($cookies.get("username")).username.split('@');
	$scope.sender = mSender[0];

	$scope.regUser = function (user) {
		gulServiceCall.regUserTwilio(user).then(function (response) {

		});
	};

	$scope.sendMessage = function () {
		gulServiceCall.sendMessageTwilio($scope.msgBody, $scope.chat_name).then(function (response) {
			$scope.msgBody = "";
			$scope.retrieveMessage();
		});
	};

	$scope.retrieveMessage = function () {
		gulServiceCall.retrieveMessageTwilio($scope.chat_name).then(function (response) {
			$scope.retMsg = response;
		});
	};

}]);