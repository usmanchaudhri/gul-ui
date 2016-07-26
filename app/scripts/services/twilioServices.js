/**
 * Created by Khan on 7/13/2016.
 */
app.factory('twilioServices', ['$cookies','twilioWebServices', function ($cookies,twilioWebServices) {

    var sdo = {

        /**
         * This method Create channel on Twilio for
         * conversation between 2 persons
         * @param friendlyName
         * @returns {*}
         */
        createChannel: function (friendlyName,shopInfo) {
            return twilioWebServices.createChannel(
                friendlyName
            ).then(function (channelData) {
                if(channelData == ''){
                    return sdo.retrieveChannel(shopInfo).then(function(){
                    });
                }else{
                    //$scope.data = data;
                    console.log("channel Sid",channelData);
                    var channelSid = channelData.data.sid;
                    var channelFriendlyName = channelData.data.friendly_name;
                    return sdo.addMembers(channelSid,channelFriendlyName,shopInfo).then(function(data){
                        console.log("addMembers",data);
                        return {
                            "uniqueName": channelSid,
                            "customerUsername": channelFriendlyName,
                            "data": data
                        }
                        return data;
                    });
                }
            });
        },

        /**
         * This method add both members who want to communicate
         * in twilio channel
         * @param channelSid
         * @param channelFriendlyName
         */
        addMembers: function (channelSid,channelFriendlyName,shopInfo) {
            var mName = JSON.parse($cookies.get("username")).username.replace(/ /g, '');
            var mDesigner = shopInfo.username.replace(/ /g, '');
            return twilioWebServices.addMembers(channelSid,mDesigner, mName).then(function (flag) {
                console.log("twilioWebServices.addMembers",flag);
                return flag;
            });
        },

        /**
         * This method Retrieve Twilio Channel if already
         * exist
         */
        retrieveChannel: function () {
            var shopName = JSON.parse($cookies.get("username")).username + "-" + $scope.shopCustomer.username.replace(/ /g, '');
            twilioWebServices.retrieveChannel(shopName)
            .then(function (data) {
                $scope.channelSid = data.entity.sid;
                var flag = true;
                for (var i = 0; i < cChatNames.length; i++) {
                    if ($scope.shopCustomer.username == cChatNames[i].name) {
                        flag = false;
                    }
                }

            });

        },

        /**
         * This method Register User on twilio so he/she can
         * use twilio services
         * @param user
         */
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

        sendMessageTwilio: function(msgBody,chat_name){
            return twilioWebServices.sendMessageTwilio(msgBody, chat_name).then(function (response) {
                return response;
            });
        }

    }
    return sdo;

}]);