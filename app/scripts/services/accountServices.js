/**
 * Created by Khan on 7/13/2016.
 */
app.factory('accountServices', [ 'restServices', function ( restServices) {

    var sdo = {


        /**
         * Get Account Detail of user
         * @returns {*}
         */
        getAccount: function () {
            return gulServiceCall.getUrls()
                .then(function (response) {
                    var url = response.data.loginUrl;
                    return restServices.getApiAuthData(url)
                        .then(function (response1) {
                            return response1.data;
                        });
                });
        },
        signIn: function (loginEmail, loginPass) {
            var base64 = Base64.encode(loginEmail + ':' + loginPass);

            var loginAuth = base64;
            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + loginAuth

                }
            }

            return sdo.getUrls().then(function (data) {
                return $http.get(
                    data.data.loginUrl, config
                ).then(function (data) {
                    console.log(data);
                    if ($cookies.get("username") != loginEmail) {
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

        },

    }
    return sdo;

}]);