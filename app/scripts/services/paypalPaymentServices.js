/**
 * Created by Khan on 6/2/2016.
 */
app.factory('paypalPaymentServices', ['$http', '$q', '$cookies', 'Base64', '$window','restServices', function ($http, $q, $cookies, Base64, $window,restServices) {
    var sdo = {

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
        }
    }

    return sdo;
}]);