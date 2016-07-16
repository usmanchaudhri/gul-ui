/**
 * Created by Khan on 6/2/2016.
 */
app.factory('twilioWebServices', ['$http', '$q', '$cookies', 'Base64', '$window','restServices', function ($http, $q, $cookies, Base64, $window,restServices) {
    var sdo = {

        createChannel: function (data,payload,tokenID) {
            return restServices.getUrls().then(function (mUrls) {

                var config = {
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };

                var data1 = $.param({
                    FriendlyName: friendlyName,
                    Type: 'private'
                });

                $http.post(
                    mUrls.data.twilioChannel,  data1,config
                ).then(function(data, status) {
                    return data;
                });


            });
        },
        retrieveChannel: function (data,payload,tokenID) {
            return restServices.getUrls().then(function (mUrls) {

                var config = {
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };


                var data1 = $.param({
                    FriendlyName: friendlyName,
                    Type: 'private'
                });

                $http.post(
                    mUrls.data.twilioChannel,  data1,config
                ).then(function(data, status) {
                    return data;
                });


            });
        },

        addMember: function(mDesigner,mName){
            var data2 = $.param({
                Identity : mDesigner
            });

            var data1 = $.param({
                Identity : mName
            });
            var promise1 = $http({
                method: 'POST',
                url: $scope.twilioChannel+'/'+$scope.channelSid+'/Members',
                data: data2,
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                },
                cache: 'true'});
            var promise2 = $http({
                method: 'POST',
                url: $scope.twilioChannel+'/'+$scope.channelSid+'/Members',
                data: data1,
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                },
                cache: 'true'});

            $q.all([promise1,promise2]).then(function(data){

                var flag = true;
                for(var i = 0; i < cChatNames.length ; i++){
                    if($scope.shopCustomer.username == cChatNames[i].name){
                        flag = false;
                    }
                }
             return flag;

            }, function onError(response) {
                console.log(response);

            });
        }

    }

    return sdo;
}]);