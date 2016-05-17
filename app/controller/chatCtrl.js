app.controller('chatCtrl', ['$scope', '$http', 'Base64', '$cookies', '$q', '$routeParams', '$timeout', 'chatList','gulServiceCall', function ($scope, $http, Base64, $cookies, $q, $routeParams, $timeout, chatList ,gulServiceCall) {

    $scope.chat_name = $routeParams.chatName;
    $scope.chatNames = chatList;
    $cookies.put("chatlist", chatList);



    $scope.regUser = function (user) {
        gulServiceCall.regUserTwilio(user).then(function (response){
            console.log(response);

        });
    };

    $scope.sendMessage = function () {
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        var mFrom = $cookies.get("username").replace(/ /g, '');
        var data1 = $.param({
            Body: $scope.msgBody,
            From: mFrom
        });
        $scope.msgBody = "";
        $http.post(
            $scope.twilioChannel + '/' + $scope.channelSid + '/Messages', data1, config
        ).success(function (data, status) {
            console.log(data);
            $scope.retrieveMessage();

        }).error(function (data, status) {
            console.log(data);
        });


    };

    $scope.retrieveMessage = function () {
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.get(
            $scope.twilioChannel + '/' + $scope.channelSid + '/Messages', config
        ).success(function (data, status) {
            $scope.retMsg = data;
            console.log(data);

        }).error(function (data, status) {
            console.log("Error");
            console.log(data);

        });

    };

    $scope.retrieveChannel = function () {
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
            }
        }
        var mUnique = "";
        console.log($scope.chat_name);
        console.log("Length" + chatList.length);

        if (angular.isDefined($scope.chat_name)) {
            for (var i = 0; i < chatList.length; i++) {
                console.log(chatList[i].name);
                if (chatList[i].name == $scope.chat_name) {
                    mUnique = $scope.chatArr[i].uniqueName;
                    console.log(mUnique);
                }
            }
        }
        $http.get(
            $scope.twilioChannel + '/' + mUnique, config
        ).success(function (data, status) {
            $scope.channelSid = data.entity.sid;

            //	addMembers();
            $scope.retrieveMessage();
            console.log(data.entity.sid);
        }).error(function (data, status) {
            console.log(data);
            console.log("3rd");
        });

    };

    var addMembers = function () {
        var data2 = $.param({
            Identity: 'Amjad'
        });
        var data1 = $.param({
            Identity: 'Uzair'
        });
        var promise1 = $http({
            method: 'POST',
            url: $scope.twilio + $scope.channelSid + '/Members',
            data: data2,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            },
            cache: 'true'
        });
        var promise2 = $http({
            method: 'POST',
            url: $scope.twilio + $scope.channelSid + '/Members',
            data: data1,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            },
            cache: 'true'
        });

        $q.all([promise1, promise2]).then(function (data) {
            console.log(data[0], data[1]);
        }, function onError(response) {
            console.log(response);
        });
    };
}]);
