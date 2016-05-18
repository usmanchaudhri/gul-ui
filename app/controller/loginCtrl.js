app.controller('loginCtrl', ['$scope', '$cookies', '$http', 'Base64', '$location', '$uibModal', '$rootScope','gulServiceCall', function ($scope, $cookies, $http, Base64, $location, $uibModal, $rootScope,gulServiceCall) {

    $scope.menuClass = true;
    $scope.showSignupError = false;
    $scope.showEmptyFieldError = false;
    $scope.showError = false;
    $scope.signingin = true;

    if ($cookies.get("username") != null) {
        $scope.userFlag = true;
    } else {
        $scope.userFlag = false;
    }

    $rootScope.$on("signin", function () {
        $scope.signin();
    });

    gulServiceCall.getUrls().then(function(response){
        $scope.twilioUser = response.data.twilioUser;
        $scope.customerUrl = response.data.customerUrl;
        $scope.signupUrl = response.data.signupUrl;
        $scope.loginUrl = response.data.loginUrl;
    });

    $scope.signin = function () {
        var modalInstance = $uibModal.open({
                templateUrl: 'loginModal.html',
                controller: 'loginModalCtrl'
            })
            .result.then(
                function (userFlag) {
                    $scope.userFlag = userFlag;
                }
            );
    }
}]);
