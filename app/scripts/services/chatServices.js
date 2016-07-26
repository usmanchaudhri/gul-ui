/**
 * Created by Khan on 6/2/2016.
 */
app.factory('chatServices', ['$rootScope', 'restServices', '$cookies', 'twilioServices', function ($rootScope, restServices, $cookies, twilioServices) {

    /**
     * In this service we deal with chat. we get chatlist and conversation in this service.
     * @type {{getChatList: sdo.getChatList, getConversationList: sdo.getConversationList, getConversationCustom: sdo.getConversationCustom}}
     */
    var sdo = {


        /**
         * This method return us list of person with which he communicate
         * @returns {*|{get}}
         */
        getChatList: function () {
            return restServices.getUrls()
                .then(function (one) {

                    console.log('Promise one resolved with ', one);
                    var cChatNames = [];
                    var config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }

                    var url = one.data.customerUrl + '/' + JSON.parse($cookies.get('username')).id + '/cchat';
                    return restServices.getApiData(url).then(function (dataa) {
                        var customerName = JSON.parse($cookies.get("username")).username;
                        if (dataa.data.length > 0) {
                            console.log(dataa);

                            var chatArr = dataa.data[0].customer.cchat;
                            for (var i = 0; i < chatArr.length; i++) {
                                var promise = sdo.getConversationCustom(chatArr[i]);
                                console.log("Promise is : ", promise);
                                promise.then(function (data) {

                                    console.log("Success : ", i);
                                    cChatNames.push(data);

                                    console.log("lastMsg : ", data);
                                }, function (reason) {

                                    console.log("Success : ", data);
                                });
                                console.log("custom conversation array", promise);
                            }
                        }
                        return cChatNames
                    });

                });
        },


        /**
         * This method take chat name as a parameter and fetch complete
         * conversation of this chat
         * @param chatNames
         * @returns {*|{get}}
         */
        getConversationList: function (chatNames) {
            var chatTitle = '';


            return restServices.getUrls()
                .then(function (one) {

                    console.log('Promise one resolved with ', one);
                    var cChatNames = [];
                    var config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }


                    return restServices.getApiData(one.data.customerUrl + '/' + $cookies.get('userId') + '/cchat').then(function (dataa) {

                        for (var i = 0; i < dataa.data.length; i++) {
                            if (dataa.data[i].uniqueName == chatNames) {
                                console.log("Channel DATA: ");
                                var designerName = JSON.parse($cookies.get("username")).username.split('@');
                                var from = dataa.data[i].shopOwnerUsername.split('@');
                                chatTitle = {
                                    "customerUsername": dataa.data[i].customerUsername,
                                    "customer": designerName[0],
                                    "designer": from[0]
                                };
                            }
                        }

                        return restServices.getApiAuthData(
                            one.data.twilioChannel + '/' + chatNames + '/Messages'
                        ).then(function (data, status) {
                            console.log("SSID", data);
                            var chatData = [];

                            for (var i = 0; i < data.data.length; i++) {

                                var from = data.data[i].from.split('@');
                                var value = {
                                    "from": from[0],
                                    "body": data.data[i].body
                                }
                                chatData.push(value);
                            }


                            console.log("CHAT TITLE",chatTitle);
                            return {
                                "chatData": chatData,
                                "cchat": chatTitle

                            };

                        });
                    });

                });
        },

        /**
         * This Method return last message of chat to show on chat list screen
         * @param obj
         * @returns {*|{get}}
         */
        getConversationCustom: function (obj) {
            var chatNames = obj.uniqueName;
            var chatTitle = '';
            return restServices.getUrls()
                .then(function (one) {
                    var cChatNames = [];
                    var config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                    return restServices.getApiAuthData(one.data.twilioChannel + '/' + chatNames + '/Messages').then(function (data, status) {
                        var chatData = [];
                        for (var i = 0; i < data.data.length; i++) {
                            var from = data.data[i].from.split('@');
                            var value = {
                                "from": from[0],
                                "body": data.data[i].body
                            }
                            chatData.push(value);
                        }
                        var lastMsg = chatData[(chatData.length - 1)].body;
                        var name = obj.shopOwnerUsername.split("@");
                        return {
                            "uniqueName": obj.uniqueName,
                            "product": obj.customerUsername,
                            "designer": name[0],
                            "lastMessage": lastMsg
                        }
                    });
                });
        },

        /**
         * This method take message and channel name as parameter and
         * send message to twilio
         * @param msgBody
         * @param chat_name
         */
        sendMessageTwilio: function (msgBody, chat_name) {
            console.log(msgBody);
            return twilioServices.sendMessageTwilio(msgBody, chat_name).then(function (response) {
                return sdo.getConversationList(chat_name).then(function (data) {
                    return data;
                });
            });
        },

        sendMessage: function () {
            console.log("ChatServices");
            twilioServices.createChannel().then(function () {

            });
        },

        sendMessage: function () {
            twilioServices.createChannel().then(function () {

            });
    }
    }
    return sdo;
}]);