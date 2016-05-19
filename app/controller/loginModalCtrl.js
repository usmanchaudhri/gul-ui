app.controller('loginModalCtrl', ['$scope', '$uibModalInstance', '$http', 'Base64', '$cookies', 'gulServiceCall', function ($scope, $uibModalInstance, $http, Base64, $cookies, gulServiceCall) {

    $scope.signingin = true;

    gulServiceCall.getUrls()
        .then(function (response) {
            $scope.twilioUser = response.data.twilioUser;
            $scope.customerUrl = response.data.customerUrl;
            $scope.signupUrl = response.data.signupUrl;
            $scope.loginUrl = response.data.loginUrl;
        });

    $scope.showSignUp = function () {
        $scope.signingin = false;
        console.log("modal signup:" + $scope.signingin);
    };

    $scope.showSignIn = function () {
        $scope.signingin = true;
        console.log("modal signin:" + $scope.signingin);
    };


    $scope.checkLogin = function (loginEmail, loginPass) {
        if (loginEmail != null && loginPass != null) {
            $scope.siginInUser(loginEmail, loginPass);
        }
    };

    $scope.registerUser = function (regEmail, regPass) {
        if (regEmail != null && regPass != null) {
            $scope.regHeroku(regEmail, regPass);
            console.log("Modal EMail" + regEmail + regPass);
        }


    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    /*User Signin*/
    $scope.siginInUser = function (loginEmail, loginPass) {

        $scope.loginEmail = loginEmail;
        $scope.loginPass = loginPass;

        gulServiceCall.signIn(loginEmail, loginPass).then(function (data) {

            if(data == 0){
                var userFlag = true;
                $uibModalInstance.close(userFlag);
            }else{
                $scope.userFlag = false;
            }
            console.log(data);

        });

    };
    /*End of User Signin*/


    /*User Signup*/
    $scope.regHeroku = function (regEmail, regPass) {
        $scope.regEmail = regEmail;
        $scope.regPass = regPass;
        console.log("RegHeroku called:" + $scope.regEmail);
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        var data = {
            "username": $scope.regEmail,
            "password": $scope.regPass
        }
        $http.post(
            $scope.signupUrl, data, config
        ).success(function (data, status) {
            console.log(data);
            $scope.loginEmail = $scope.regEmail;
            $scope.loginPass = $scope.regPass;
            regUser($scope.regEmail);
            //$cookies.put("username",JSON.stringify(data));
            var shopId;
            if (angular.isDefined(data.shop)) {
                shopId = data.shop.id;
            } else {
                shopId = 0;
            }
            var value = {
                "username": data.username,
                "password": $scope.loginPass,
                "id": data.id,
                //"shopId": data.shop.id
                "shopId": shopId
            };
            $cookies.put("username", JSON.stringify(value));
            console.log("New User Object: ", $cookies.get("username"));
            var userFlag = true;
            $uibModalInstance.close(userFlag);

        }).error(function (data, status) {
            $scope.showSignupError = true;
            console.log("Registration Erro" + data);
            console.log(status);
        });

    }

    var regUser = function (user) {
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var data = $.param({
            Identity: user
        });

        $http.post(
            $scope.twilioUser, data, config
        ).success(function (data, status) {
            $scope.data = data;
            /*$cookies.put("userTwilio",data.sid);*/

        }).error(function (data, status) {
            console.log(data);

        });
    }

    /*End of User Signup*/
}]);