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


        getPromiseData: function (shop_id,url1,url2) {
            return sdo.getUrls().
            then(function (response) {
                var promise1 = $http({
                    method: 'GET',
                    url: url1, //response.data.shopUrl + '/' + shop_id + '/products',
                    cache: 'true'
                });
                var promise2 = $http({
                    method: 'GET',
                    url: url2,//response.data.shopUrl + '/' + shop_id + '/designers',
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