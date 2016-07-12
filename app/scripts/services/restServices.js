/**
 * Created by Khan on 6/2/2016.
 */
app.factory('restServices', ['$http', '$q', '$cookies', 'Base64', '$window', function ($http, $q, $cookies, Base64, $window) {
    var sdo = {

        getUrls: function () {
            return $http.get('gulgs.properties')
                .then(function (one) {
                    return one;
                });
        },

        getApiData: function (url) {

            return sdo.getUrls()
                .then(function (response) {
                    return $http.get(url)
                        .then(function (data) {
                            return data;
                        });
                });
        },

        getApiAuthData: function (url) {
            var loginAuth = Base64.encode(JSON.parse($cookies.get("username")).username +
                ':' + JSON.parse($cookies.get("username")).password);
            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + loginAuth
                }
            }
            return $http.get(url, config)
                .then(function (data) {
                    return data;
                });

        },

        getApiAuthDataHeroku: function (url,username,pass) {
            var loginAuth = Base64.encode(username + ':' + pass);
            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + loginAuth
                }
            }
            return $http.get(url, config)
                .then(function (data) {
                    return data;
                });

        },

        postApiData: function(url,data){
            var config = {
                headers: {
                    'Content-Type': 'application/json'}
            }
            return $http.post(url, data, config
            ).then(function (data) {
                return data;
            });
        },

        postApiAuthData: function (url, data) {
            var loginAuth = Base64.encode(JSON.parse($cookies.get("username")).username +
                ':' + JSON.parse($cookies.get("username")).password);
            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + loginAuth
                }
            }
            return $http.post(url, data, config
            ).then(function (data) {
                return data;
            });
        },

        postTwilioData: function (url, data) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
            return $http.post(url, data, config
            ).then(function (data) {
                return data;
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
                      //  console.log("0000",data.data);
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
        },

        submitPayment: function (data,payload,tokenID) {
            return sdo.getUrls().then(function (mUrls) {

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

        getShop: function (shop_id) {
            return sdo.getUrls().
            then(function (response) {
                var promise1 = $http({
                    method: 'GET',
                    url: response.data.shopUrl + '/' + shop_id + '/products',
                    cache: 'true'
                });
                var promise2 = $http({
                    method: 'GET',
                    url: response.data.shopUrl + '/' + shop_id + '/designers',
                    cache: 'true'
                });
                return $q.all([promise1, promise2]).then(function (data) {
                    return data;
                });
            });
        }
    }

    return sdo;
}]);