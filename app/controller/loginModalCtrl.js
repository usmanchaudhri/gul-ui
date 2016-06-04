app.controller('loginModalCtrl', ['$scope', '$uibModalInstance', '$http', 'Base64', '$cookies', 'loginFactory', function ($scope, $uibModalInstance, $http, Base64, $cookies, loginFactory) {

    $scope.signingin = true;

    loginFactory.getUrls()
        .then(function (response) {
            $scope.twilioUser = response.data.twilioUser;
            $scope.customerUrl = response.data.customerUrl;
            $scope.signupUrl = response.data.signupUrl;
            $scope.loginUrl = response.data.loginUrl;
        });

    $scope.showSignUp = function () {
        $scope.signingin = false;
    };

    $scope.showSignIn = function () {
        $scope.signingin = true;
    };


    $scope.checkLogin = function (loginEmail, loginPass) {
        if (loginEmail != null && loginPass != null) {
            $scope.siginInUser(loginEmail, loginPass);
        }
    };

    $scope.registerUser = function (regEmail, regPass) {
        if (regEmail != null && regPass != null) {
            $scope.regHeroku(regEmail, regPass);
        }


    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    /*User Signin*/
    $scope.siginInUser = function (loginEmail, loginPass) {

        $scope.loginEmail = loginEmail;
        $scope.loginPass = loginPass;

        loginFactory.signIn($scope.loginEmail, $scope.loginPass).then(function (data) {
            if (data == 0) {
                var userFlag = true;
                $uibModalInstance.close(userFlag);
            } else {
                $scope.userFlag = false;
            }
        });

    };
    /*End of User Signin*/


    /*User Signup*/
    $scope.regHeroku = function (regEmail, regPass) {
        loginFactory.regHeroku(regEmail, regPass).then(function (data) {
            if (data)
                $uibModalInstance.close(data);
        });

    }


    /*End of User Signup*/
}]);