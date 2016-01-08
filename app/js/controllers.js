var app = angular.module("MyApp", []);

app.controller("MyCtrl", function($scope, $q, $http, $timeout) {

  $scope.nestedTest = function() {
    tmp = [];

    $http.get("/app/data/first.json").success(function(data) {
      tmp.push(data);
      $http.get("/app/data/second.json").success(function(data) {
        tmp.push(data);
        $http.get("/app/data/third.json").success(function(data) {
          tmp.push(data);
          $scope.combinedNestedResult = tmp.join(", ");
        });
      });
    });
  };

  $scope.allTest = function() {
  var promise1 = $http({method: 'GET', url: 'https://gul-product-service.herokuapp.com:443/gul-product-service/shop', cache: 'true'});
var promise2 = $http({method: 'GET', url: 'https://gul-product-service.herokuapp.com/gul-product-service/category', cache: 'true'});

$q.all([promise1, promise2]).then(function(data){
	
	//$scope.combinedNestedResult = data[0].data;
	$scope.combinedResult = data[1].data;
	
	console.log(data[0], data);
});
  };

  $scope.startDeferredTimer = function(success) {
    deferredTimer(success).then(
      function(data) {
        $scope.deferredTimerResult = "Successfully finished: " + data.message;
      },
      function(data) {
        $scope.deferredTimerResult = "Failed: " + data.message;
      }
    );
  };

  function deferredTimer(success) {
    var deferred = $q.defer();

    $timeout(function() {
      if (success) {
        deferred.resolve({ message: "This is great!" });
      } else {
        deferred.reject({ message: "Really bad" });
      }
    }, 1000);

    return deferred.promise;
  }

});