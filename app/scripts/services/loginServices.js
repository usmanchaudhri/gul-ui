/**
 * Created by Khan on 6/2/2016.
 */
app.factory('loginServices', ['$rootScope', 'restServices','$cookies','$q','twilioWebServices', function ($rootScope, restServices,$cookies,$q,twilioWebServices) {

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
         *This Method  register user on server and then
         * on twilio for sending and receiving msgs
         * @param user
         * @param email
         * @param pass
         * @returns {*|{get}}
         */

        registerUser: function(email,pass){

            var data = {
                "username": email ,
                "password": pass
            }
            return restServices.getUrls().then(function(response){
               return restServices.postApiData(response.data.signupUrl,data).then(function(responseData){
                   var postData = $.param({
                       Identity: email
                   });
                   return twilioWebServices.registerUserOnTwilio(response.data.twilioUser, postData).then(function (data) {
                       var shopId;
                       if (angular.isDefined(responseData.shop)) {
                           shopId = responseData.shop.id;
                       } else {
                           shopId = 0;
                       }
                       var value = {
                           "username": responseData.data.username,
                           "password": pass,
                           "id": responseData.data.id,
                           "shopId": shopId
                       };
                       $cookies.put("username", JSON.stringify(value));
                      // console.log("DATA COMPLETE",responseData);

                       return true;

                   });
                   });
            });

        }
    }
    return sdo;
}]);