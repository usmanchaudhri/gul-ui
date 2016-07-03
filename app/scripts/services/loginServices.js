/**
 * Created by Khan on 6/2/2016.
 */
app.factory('loginServices', ['$rootScope', 'restServices','$cookies','$q', function ($rootScope, restServices,$cookies,$q) {

    var sdo = {

        regUserTwilio: function (user) {
            var data = $.param({
                Identity: user
            });
            restServices.getUrls().then(function (response) {
                var url = response.data.twilioUser;
                restServices.postTwilioData(url, data)
                    .then(function (data) {
                        return data;
                    });
            });
        },
        getUrls: function () {
            return restServices.getUrls().then(function (data) {
                return data;
            });
        },
        userLogout: function () {
            var defferred = $q.defer();
            if ($cookies.get("username") != null) {
                $cookies.remove("username");
                defferred.resolve(false);
            } else {
                defferred.resolve(true);
            }
            return defferred.promise;

        },
        signIn: function (loginEmail,loginPass) {


            return restServices.getUrls().then(function (data) {
                var url = data.data.loginUrl;
                return restServices.getApiAuthDataHeroku(url,loginEmail,loginPass)
                    .then(function (data) {
                        if ($cookies.get("username") != loginEmail) {
                            var value = {
                                "username": data.data.username,
                                "password": loginPass,
                                "id": data.data.id,
                                "shopId": JSON.stringify(data.data.shop)
                            };
                            $cookies.put("username", JSON.stringify(value));
                            $cookies.put("userId", data.data.id);
                            return 0;
                        } else {
                            return 1;
                        }

                    });
            });
        },
        regUser: function (user,email,pass) {
            var postData = $.param({
                Identity: user
            });
            return restServices.getUrls().then(function (data) {
                restServices.postTwilioData(data.data.twilioUser, postData).then(function (data) {
                    return data;
                });
            });
        },
        regHeroku: function(email,pass){

            var data = {
                "username": email ,
                "password": pass
            }
            return restServices.getUrls().then(function(response){
               return restServices.postApiData(response.data.signupUrl,data).then(function(responseData){
                   return sdo.regUser(email,email,pass).then(function(){
                       var shopId;
                       if (angular.isDefined(responseData.shop)) {
                           shopId = data.shop.id;
                       } else {
                           shopId = 0;
                       }
                       var value = {
                           "username": data.username,
                           "password": pass,
                           "id": data.id,
                           "shopId": shopId
                       };
                       $cookies.put("username", JSON.stringify(value));
                       return true;

                   });
                   });
            });

        }
    }
    return sdo;
}]);