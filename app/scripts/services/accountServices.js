/**
 * Created by Khan on 7/13/2016.
 */
app.factory('accountServices', [ 'restServices','Base64','$http','$cookies', function ( restServices,Base64,$http,$cookies) {

    /**
     * This Factory is for all methods relted to user information
     * @type {{getAccount: sdo.getAccount, signIn: sdo.signIn}}
     */
    var sdo = {


        /**
         * This method return all information of loged in user
         * @returns {*}
         */
        getAccount: function () {
            return restServices.getUrls()
                .then(function (response) {
                    var url = response.data.loginUrl;
                    return restServices.getApiAuthData(url)
                        .then(function (response1) {
                            return response1.data;
                        });
                });
        },

        /**
         * This method take loginEmail and password as a parameter. call webservice to authanticate user and get its information
         * @param loginEmail
         * @param loginPass
         * @returns {*|{get}}
         */
        signIn: function (loginEmail, loginPass) {
            var base64 = Base64.encode(loginEmail + ':' + loginPass);

            var loginAuth = base64;
            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + loginAuth

                }
            }

            return restServices.getUrls().then(function (data) {
                return $http.get(
                    data.data.loginUrl, config
                ).then(function (data) {
                    console.log("USERNAME",data.data.username);
                    if (data.data.username == loginEmail) {
                        var value = {
                            "username": data.data.username,
                            "password": loginPass,
                            "id": data.data.id,
                            "shopId": JSON.stringify(data.data.shop)
                        };
                        $cookies.put("username", JSON.stringify(value));
                        $cookies.put("userId", data.data.id);
                        console.log("VALUE: ", value);
                        return 0;
                    } else {
                        return 1;
                    }
                });
            });
        }
    }
    return sdo;

}]);