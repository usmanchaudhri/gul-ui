/**
 * Created by Khan on 6/2/2016.
 */
app.factory('twilioWebServices', ['$http', '$q', '$cookies', 'Base64', '$window', 'restServices', function ($http, $q, $cookies, Base64, $window, restServices) {
    var sdo = {


        registerUserOnTwilio: function (url, data) {
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

        createChannel: function (friendlyName) {
            console.log("twilioWebServices",friendlyName);
            return restServices.getUrls().then(function (mUrls) {

                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };

                var data1 = $.param({
                    FriendlyName: friendlyName,
                    Type: 'private'
                });

                return $http.post(
                    mUrls.data.twilioChannel, data1, config
                ).then(function (data, status) {
                    return data;
                });


            });
        },
        retrieveChannel: function (data, payload, tokenID) {
            return restServices.getUrls().then(function (mUrls) {

                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };
                var data1 = $.param({
                    FriendlyName: friendlyName,
                    Type: 'private'
                });

                $http.post(
                    mUrls.data.twilioChannel, data1, config
                ).then(function (data, status) {
                    return data;
                });


            });
        },

        addMembers: function (channelSid,mDesigner, mName) {
            console.log("MNAME",channelSid);
            return restServices.getUrls().then(function (mUrls) {
                var data2 = $.param({
                    Identity: mDesigner
                });

                var data1 = $.param({
                    Identity: mName
                });
                var promise1 = $http({
                    method: 'POST',
                    url: mUrls.data.twilioChannel + '/' + channelSid + '/Members',
                    data: data2,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    },
                    cache: 'true'
                });
                var promise2 = $http({
                    method: 'POST',
                    url: mUrls.data.twilioChannel + '/' + channelSid + '/Members',
                    data: data1,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    },
                    cache: 'true'
                });

                return $q.all([promise1, promise2]).then(function (data) {

                    console.log("twilioWebServices add members",data);
                    return data;

                }, function onError(response) {
                    console.log(response);

                });
            });
        },

        sendMessageTwilio: function(msgBody,channelSid){
            return restServices.getUrls().then(function(data){
                var mFrom = JSON.parse($cookies.get("username")).username;
                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };
                var data1 = $.param({
                    Body: msgBody,
                    From: mFrom
                });
                return $http.post(
                    data.data.twilioChannel + '/' + channelSid + '/Messages', data1, config
                ).then(function (data) {
                    console.log("Twilio webservices sendMessageTwilio",data);
                    return data;

                });

            });
        }


    }

    return sdo;
}]);