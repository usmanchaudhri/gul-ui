app.controller('modalCtrl', ['$scope', '$uibModalInstance', 'name', function ($scope, $uibModalInstance, name) {

	$scope.productDetailName = name;

	/**
	 * This  is use to send message to
	 * designer from Product Detail Page.
	 * @param msg
     */
	$scope.send = function (msg) {
		$uibModalInstance.close(msg);
	};

	/**
	 * This method close sending message pop up
	 */
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

}]);
