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

    $scope.userLogout = function(){
        if($cookies.get("username") != null){
            $cookies.remove("username");
            $scope.userFlag = false;

            $location.path("#/");
            console.log("user Logged out!"+$cookies.get("username"));
        }else{
            $scope.userFlag = true;
        }


        console.log("Email after logout"+$cookies.get("username"));
    };

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
