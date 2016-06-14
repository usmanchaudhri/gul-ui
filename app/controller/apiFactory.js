/**
 * Created by Khan on 6/2/2016.
 */
// app.factory('apiFactory', ['$http', '$q', '$cookies', 'Base64', '$window', function ($http, $q, $cookies, Base64, $window) {
app.factory('apiFactory', ['$http','$q', function ($http, $q) {

    var sdo = {
        
        getValue: function() {
            return 10;
        },

        getUrls: function () {
            console.log("Get Url"); 
            return $http.get('gulgs.properties')
                .then(function (one) {
                    console.log("One", one);
                    console.log("One data", one.data.shopUrl);
                    return one;
                }, function errorCallBack(response) {
                    console.log("Error");                    
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
            var loginAuth = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
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

        postApiAuthData: function (url, data) {
            var loginAuth = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
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

        paypalToken: function (data) {
            return sdo.getUrls().then(function (response) {
                var base64 = Base64.encode(response.data.paypalClientID + ':' + response.data.paypalSecretKey);

                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                        'Authorization': 'Basic ' + base64
                    }
                }
                var data = $.param({
                    grant_type: "client_credentials"
                });
                return $http.post(response.data.paypalToken).success(function (data) {
                    return data;

                }).error(function (data, status) {
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

        pyapalPayment: function () {
            sdo.getUrls().then(function () {
                var config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': data.token_type + ' ' + tokenID
                    }
                }
                return $http.post(
                    mUrls.paypalPayment, paypalPayloads, config
                ).success(function (data, status) {
                    $window.location.href = data.links[1].href;
                }).error(function (data, status) {
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
                    console.log("Data:" + data[0].status);
                    return data;
                });
            });
        }
    }

    return sdo;
}]);