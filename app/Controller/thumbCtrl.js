
app.config(function (LightboxProvider) {
  // set a custom template
  LightboxProvider.templateUrl = 'view/upload/lightbox-temp.html';
});

  app.controller('AppCtrl', function ($scope, Lightbox) {
  $scope.images = [];
  $scope.openLightboxModal = function (img) {
   $scope.images.push(img);
    Lightbox.openModal($scope.images, 0);
  };
  
  
});