/**
 * Created by Khan on 6/2/2016.
 */
app.factory('paypalPaymentServices', ['$http', '$q', '$cookies', 'Base64', '$window','restServices', function ($http, $q, $cookies, Base64, $window,restServices) {
    var sdo = {


        /**
         * This method hit paypal web service
         * @param data
         * @param payload
         * @param tokenID
         * @returns {*|{get}}
         */
        submitPayment: function (data,payload,tokenID) {
            return restServices.getUrls().then(function (mUrls) {

                var obj = {};
                //    var tokenID = "0asd";
                var config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': data.token_type + ' ' + tokenID
                    }
                }
                console.log("DATA", payload);
                return $http.post(
                    mUrls.data.submitPaymentUrl, payload, config
                ).success(function (data, status) {
                    $window.location.href = data.links[1].href;
                }).error(function (data, status) {
                    if (data != null) {
                        return  {
                            loadingData: false,
                            dataError: data
                        };
                    } else {
                        return  {
                            loadingData: false,
                            dataError: "Check Your Internet Connection And Try Again! "
                        };
                    }
                })
            });
        },
        getToken: function () {
            //console.log("REQUEST");
            return sdo.getUrls().then(function (response) {
                //console.log("REQUEST",response);
                var base64 = Base64.encode(response.data.paypalClientID + ':' +
                    response.data.paypalSecretKey);
                var obj = {};
                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                        'Authorization': 'Basic ' + base64
                    }
                }
                var data = $.param({
                    grant_type: "client_credentials"
                });
                return $http.post(response.data.getToken,data,config).then(
                    function (data) {
                        console.log("0000",data.data);
                        return data.data;
                    },function(data) {
                        console.log("Error");
                        if (data != null) {
                            return obj = {
                                loadingData: false,
                                dataError: data
                            };
                        } else {
                            return obj = {
                                loadingData: false,
                                dataError: "Check Your Internet Connection And Try Again! "
                            };
                        }
                    });
            });
        }
    }

    return sdo;
}]);