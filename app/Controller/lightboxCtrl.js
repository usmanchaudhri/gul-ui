app.controller('LightboxCtrl', function ($scope, $window) {
  $scope.alert = function (message) {
    $window.alert(message);
  };
  });