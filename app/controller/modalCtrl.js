 app.controller('modalCtrl',['$scope','$uibModalInstance','name', function($scope,$uibModalInstance,name) {
 	$scope.send = function (shopid) {
 		
    $uibModalInstance.close(shopid);
  };
	
	$scope.productDetailName = name;

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
 	
 }]);
 
 