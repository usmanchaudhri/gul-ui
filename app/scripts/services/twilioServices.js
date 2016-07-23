/**
 * Created by Khan on 7/13/2016.
 */
app.factory('twilioServices', ['twilioWebServices', function (twilioWebServices) {

    var sdo = {

        createChannel: function (friendlyName) {
            twilioWebServices.createChannel(
                friendlyName
            ).then(function (data, status) {
                return data;
            });
        },
        addMembers: function () {
            var mName = JSON.parse($cookies.get("username")).username.replace(/ /g, '');
            var mDesigner = $scope.shopCustomer.username.replace(/ /g, '');

            twilioWebServices.addMembers(mDesigner, mName).then(function (flag) {
                if (flag) {
                    updateCustomer();
                } else {
                    composeMsg();
                }
            });
        },
        retrieveChannel: function () {
            var shopName = JSON.parse($cookies.get("username")).username + "-" + $scope.shopCustomer.username.replace(/ /g, '');
            twilioWebServices.retrieveChannel(shopName)
            .then(function (data, status) {
                $scope.channelSid = data.entity.sid;
                var flag = true;
                for (var i = 0; i < cChatNames.length; i++) {
                    if ($scope.shopCustomer.username == cChatNames[i].name) {
                        flag = false;
                    }
                }

            });

        },
        registerUserOnTwilio: function (user) {
            var data = $.param({
                Identity: user
            });
            restServices.getUrls().then(function (response) {
                var url = response.data.twilioUser;
                restServices.postTwilioData(url, data)
                    .then(function (data) {
                        return data;
                    });
            });
        },
        composeMsg : function(){
            console.log("mFrom: "+JSON.parse($cookies.get("username")).username);
            var	mFrom = JSON.parse($cookies.get("username")).username;
            var data1 = $.param({
                Body : $scope.msgBody,
                From : mFrom
            });
            $scope.msgBody = "";
            $http.post(
                $scope.twilioChannel+'/'+$scope.channelSid+'/Messages',  data1,config
            ).success(function(data, status) {
                console.log(data);

            }).error(function (data, status) {
                console.log(data);
            });

        }
    }
    return sdo;

}]);