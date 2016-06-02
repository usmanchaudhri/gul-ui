app.controller('BreadcrumbCtrl', ['$scope', 'breadcrumbs', function ($scope, breadcrumbs) {
	$scope.breadcrumbs = breadcrumbs;


	/**
	 * Get Page Label from RouteProvider as a breadcrumb to set color of menu
	 */

	$scope.breadcrumbsCalling = function () {
		$scope.enableBorder;
		$scope.breadcrumbLength = $scope.breadcrumbs.get().length;
		if ($scope.breadcrumbLength > 1) {
			$scope.enableBorder = "1px solid #E2E2E2";
			$scope.menuColor = "black";
			$scope.menuMargin = "125px";
		} else {
			$scope.menuColor = "white";
			$scope.enableBorder = "none";
			$scope.menuMargin = "0px";
		}

	}


}]);