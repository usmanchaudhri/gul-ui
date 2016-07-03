app.controller('thankuCtrl', ['$scope', '$location', 'Base64', '$cookies', 'gulServiceCall', '$q', function ($scope, $location, Base64, $cookies, gulServiceCall, $q) {
	$scope.isNumber = angular.isNumber;
	$scope.totalPrice = 0;
	$scope.qty = 0;

	$scope.items = $cookies.get("invoices", $scope.invoices);

	gulServiceCall.getUrls().then(function (response) {
		$scope.submitPaymentUrl = response.data.submitPayment;
		$scope.submitOrder();
	});
	$scope.submitOrder = function () {
		var promises = [];
		$scope.showProgress = true;
		for (var i = 0; i < $scope.items.length; i++) {
			console.log($scope.items);
			promises.push(gulServiceCall.submitOrder($scope.orderPayload($scope.items[i])));
		}
		$q.all(promises).then(function () {
			console.log("ORDER SUBMIT");
			$location.path("#/");

		});
		$cookies.remove("invoices");
		$scope.items = {};
	};

	$scope.orderPayload = function (itemDetail) {

		return payload = {
			"productId": itemDetail.id,
			"productName": itemDetail.name,
			"productSku": "Birds Han",
			"productQuantity": itemDetail.qty,
			"productPrice": itemDetail.cost,
			"productImagePath": "/listing",
			"productCategoryId": itemDetail.category.id,
			"productShopId": itemDetail.shopID,
			"customer": {
				"id": "54"
			}
		}
	}

}]);