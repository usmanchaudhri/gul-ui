app.controller('loginCtrl', ['$scope', '$cookies', '$location', '$uibModal', '$rootScope', 'loginServices', function ($scope, $cookies, $location, $uibModal, $rootScope, loginServices) {

    $scope.menuClass = true;
    $scope.showSignupError = false;
    $scope.showEmptyFieldError = false;
    $scope.showError = false;
    $scope.signingin = true;


    /**
     * Here we take decision that user is alrady
     * login or not
     */
    if ($cookies.get("username") != null) {
        $scope.userFlag = true;
    } else {
        $scope.userFlag = false;
    }


    /**
     * This method invoke when user click on logout,
     * it remove user information from cookies and
     * logout user
     */
    $scope.userLogout = function () {
        loginServices.userLogout().then(function (data) {
            if (!data) {
                $scope.userFlag = data
                $location.path("#/");
            }

        });
        //$location.path("#/");
    };

    /**
     * This methon invoke id signin method is
     * invoke from other controller it invoke
     * its signin method
     */
    $rootScope.$on("signin", function () {
        $scope.signin();
    });


    /**
     * This open User sing in and sign up pop
     */
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