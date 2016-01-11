//inject angular file upload directives and services.
var app = angular.module('fileUpload', ['ngFileUpload']);
app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);
app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
	
    $scope.uploadPic = function(file) {
    file.upload = Upload.upload({
      url: 'https://content.dropboxapi.com/1/files/auto/gul/product/images?access_token=UQkhjQYKpOEAAAAAAAAAsEi5Y5enzU4nIHL9SvyRU0oiIo5dUXAoolRn-Py3e0Ne',
      data: {file: file, username: $scope.username},
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
      });
    }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
    }
}]);