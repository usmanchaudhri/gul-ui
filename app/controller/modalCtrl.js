 app.controller('modalCtrl',['$scope','$uibModalInstance','name', function($scope,$uibModalInstance,name) {
 	$scope.send = function (msg) {
 		
    $uibModalInstance.close(msg);
  };
	
	$scope.productDetailName = name;

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
 	
 }]);
 
 