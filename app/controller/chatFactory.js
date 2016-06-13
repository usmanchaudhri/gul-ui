/**
 * Created by Khan on 6/2/2016.
 */
app.factory('chatFactory', [ '$rootScope', 'apiFactory','$cookies', function ( $rootScope, apiFactory,$cookies) {

    var sdo = {
        getChatList: function() {



            return apiFactory.getUrls()
                .then(function(one) {

                    console.log('Promise one resolved with ', one);
                    var cChatNames = [];
                    var config = {
                        headers : {
                            'Content-Type': 'application/json'
                        }
                    }

                    var url = one.data.customerUrl+'/'+JSON.parse($cookies.get('username')).id+'/cchat';
                    return apiFactory.getApiData(url).then(function(dataa) {
                        var	customerName = JSON.parse($cookies.get("username")).username;
                        if(dataa.data.length > 0){
                            console.log(dataa);

                            var chatArr = dataa.data[0].customer.cchat;
                            for(var i = 0;i< chatArr.length;i++){
                     var promise = sdo.getConversationCustom(chatArr[i]);
                                console.log("Promise is : ",promise);
                                promise.then(function(data) {

                                    console.log("Success : ",i);
                                    cChatNames.push(data);

                                    console.log("lastMsg : ",data);
                                }, function(reason) {

                                    console.log("Success : ",data);
                                });
                                console.log("custom conversation array",promise);
                            }
                        }
                        return cChatNames
                    });

                });
        },
        /*List of Conversation*/
        getConversationList: function(chatNames) {
            var chatTitle = '';


            return apiFactory.getUrls()
                .then(function(one) {

                    console.log('Promise one resolved with ', one);
                    var cChatNames = [];
                    var config = {
                        headers : {
                            'Content-Type': 'application/json'
                        }
                    }


                    return apiFactory.getApiData(one.data.customerUrl+'/'+$cookies.get('userId')+'/cchat').then(function(dataa) {

                        console.log("Channel DATA: ",dataa);

                        for(var i = 0;i < dataa.data.length ; i++){
                            if(dataa.data[i].uniqueName == chatNames){
                                var	designerName = JSON.parse($cookies.get("username")).username.split('@');
                                var from = dataa.data[i].shopOwnerUsername.split('@');
                                chatTitle = {
                                    "customerUsername": dataa.data[i].customerUsername,
                                    "customer": designerName[0],
                                    "designer": from[0]
                                };
                            }
                        }

                        return	apiFactory.getApiAuthData(
                            one.data.twilioChannel+'/'+chatNames+'/Messages'
                        ).then(function(data, status) {
                            console.log("SSID",data);
                            var chatData = [];

                            for(var i = 0;i<data.data.length ; i++){

                                var from = data.data[i].from.split('@');
                                var value = {
                                    "from": from[0],
                                    "body":	data.data[i].body
                                }
                                chatData.push(value);
                            }



                            return {
                                "chatData": chatData,
                                "cchat": chatTitle

                            };

                        });
                    });

                });
        },
        getConversationCustom: function(obj){

        //return function() {
        var chatNames =	obj.uniqueName;
        var chatTitle = '';


        return apiFactory.getUrls()
            .then(function(one) {

                console.log('Promise one resolved with ', one);
                var cChatNames = [];
                var config = {
                    headers : {
                        'Content-Type': 'application/json'
                    }
                }

                return	 apiFactory.getApiAuthData(one.data.twilioChannel+'/'+chatNames+'/Messages').then(function(data, status) {
                    console.log("SSID",data);
                    var chatData = [];

                    console.log("Message DATA",data);
                    for(var i = 0;i<data.data.length ; i++){

                        var from = data.data[i].from.split('@');
                        var value = {
                            "from": from[0],
                            "body":	data.data[i].body
                        }
                        chatData.push(value);
                    }


                    console.log("chatData",chatData);
                    var lastMsg = chatData[(chatData.length-1)].body;

                    var name = obj.shopOwnerUsername.split("@");
                    return cName = {
                        "uniqueName": obj.uniqueName,
                        "product": obj.customerUsername,
                        "designer": name[0],
                        "lastMessage": lastMsg

                    }
                });

            });
        }
    }
    return sdo;
}]);