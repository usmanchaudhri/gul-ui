/**
 * Created by Khan on 6/2/2016.
 */
app.factory('loginServices', ['$rootScope', 'restServices','$cookies','$q', function ($rootScope, restServices,$cookies,$q) {

    var sdo = {

        /**
         * this api clear user login information and logout user
         * @returns {*}
         */
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

        /**
         *This
         * @param user
         * @param email
         * @param pass
         * @returns {*|{get}}
         */
        registerUser: function (user) {
            var postData = $.param({
                Identity: user
            });
            return restServices.getUrls().then(function (data) {
                restServices.postTwilioData(data.data.twilioUser, postData).then(function (data) {
                    return data;
                });
            });
        },
        registerUserOnServer: function(email,pass){

            var data = {
                "username": email ,
                "password": pass
            }
            return restServices.getUrls().then(function(response){
               return restServices.postApiData(response.data.signupUrl,data).then(function(responseData){
                   return sdo.registerUser(email,email,pass).then(function(){
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