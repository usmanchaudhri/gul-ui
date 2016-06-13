app.controller('chatCtrl', ['$scope', '$routeParams', 'chatList','$cookies', function ($scope,  $routeParams, chatList,$cookies) {

	$scope.chat_name = $routeParams.chatName;
	$scope.chatNames = chatList;
	$cookies.put("chatlist", chatList);
	

}]);