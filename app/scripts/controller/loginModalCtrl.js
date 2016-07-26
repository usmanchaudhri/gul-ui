app.controller('loginModalCtrl', ['$scope', '$uibModalInstance','loginServices', 'accountServices', function ($scope, $uibModalInstance, loginServices, accountServices) {

    $scope.signingin = true;


    /**
     * Its  change signin variable value when some when
     * hit already member button on login pop up and
     * show sign in pop layout
     */
    $scope.showSignUp = function () {
        $scope.signingin = false;
    };


    /**
     * Its  change signin variable value when some when
     * hit join Gulgs button on login pop up and
     * show sign up pop layout
     */

    $scope.showSignIn = function () {
        $scope.signingin = true;
    };


    /**
     * It take parameter from login pop up  screen
     * and pass it to signin  method to check
     * crediantils and get user data
     * @param loginEmail
     * @param loginPass
     */
    $scope.checkLogin = function (loginEmail, loginPass) {
        if (loginEmail != null && loginPass != null) {
            accountServices.signIn($scope.loginEmail, $scope.loginPass).then(function (data) {
                if (data == 0) {
                    var userFlag = true;
                    $uibModalInstance.close(userFlag);
                } else {
                    $scope.userFlag = false;
                }
            });
        }
    };

    /**
     * It take parameter of sign up pop and pass it to
     * loginServices to register new user
     *
     * @param regEmail
     * @param regPass
     */
    $scope.registerUser = function (regEmail, regPass) {
        if (regEmail != null && regPass != null) {
            loginServices.registerUser(regEmail, regPass).then(function (data) {
                if (data)
                    $uibModalInstance.close(data);
            });
        }
    }

    /**
     * It close open Pop up on click cancel
     * button
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);