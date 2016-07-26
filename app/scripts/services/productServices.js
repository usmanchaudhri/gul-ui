/**
 * Created by Khan on 7/13/2016.
 */
app.factory('productServices', ['$cookies','restServices', 'twilioServices','productWebServices','twilioWebServices', function ($cookies,restServices, twilioServices,productWebServices,twilioWebServices) {

    var sdo = {


        /**
         * This method take prodcut id as a parameter
         * and return specific object detail
         * @param pro_id
         * @returns {*|{get}}
         */
        getProductDetail: function (pro_id) {
            return restServices.getUrls()
                .then(function (response) {
                    var url = response.data.productUrl + '/' + pro_id;
                    return restServices.getApiData(url)
                        .then(function (data) {
                            var value = {
                                urls: response.data,
                                fixPath: response.data.fixImagePath,
                                fixPathShop: response.data.fixImagePathShop,
                                token: response.data.token,
                                productDetail: data.data,
                                selectedItem: data.data.productVariation[0].size
                            };
                            console.log("PRoduct Detail: ", value);
                            return value;
                        });
                });
        },

        /**
         * This method call when user send message to
         * Designer by Clicking Ask Designer button on
         * Prodcut Detail page
         * @param friendlyName
         * @param productDetail
         * @returns {*}
         */
        contactProductDesigner: function (friendlyName, productDetail,msg) {
            return sdo.getProductDesignerShop(productDetail.shop.id).then(function (shopData) {
                return twilioServices.createChannel(friendlyName, shopData.data).then(function (data) {
                    var data1 = {
                        "uniqueName":  data.uniqueName,
                        "customerUsername": data.customerUsername,
                        "shopOwnerUsername": shopData.data.username
                    };
                    var flag = true;
                    return sdo.getChatList().then(function (cChatNames) {
                        for (var i = 0; i < cChatNames.length; i++) {
                            if (shopData.data.username == cChatNames[i].name) {
                                flag = false;
                            }
                        }
                        if (flag) {
                            return sdo.updateCustomerChannelName(shopData.data,data1,data,msg).then(function(data){
                                return data;
                            });
                        } else {
                            return sdo.composeMsg(msg,data).then(function(data){
                                console.log("Product Services contactProductDesigner",data);
                                return data;
                            });
                        }
                    });
                });
            });

        },

        /**
         * This method return shop information of product
         * owner
         */
        getProductDesignerShop: function (shopID) {
            return restServices.getUrls().then(function (data) {
                var url = data.data.shopUrl + "/" + shopID + "/shopOwner";
                return restServices.getApiAuthData(url).then(function (data) {
                    return data;
                });
            });

        },


        getChatList: function () {
            return restServices.getUrls().then(function (data) {
                var url = data.data.customerUrl + "/" + JSON.parse($cookies.get("username")).id + "/cchat";
                return restServices.getApiData(url).then(function (data) {
                    var customerName = JSON.parse($cookies.get("username")).username;

                    var cChatNames = [];
                    if (angular.isDefined(data[0])) {
                        console.log(data[0].customer);

                        var chatArr = data[0].customer.cchat;
                        for (var i = 0; i < chatArr.length; i++) {
                            var uName = chatArr[i].uniqueName.split("-");
                            if (uName[0] == customerName) {
                                var cName = {
                                    "name": uName[1]
                                }
                            } else {
                                var cName = {
                                    "name": uName[0]
                                }
                            }
                            console.log(cName);
                            cChatNames.push(cName);
                        }
                    }
                    return cChatNames;
                });
            });
        },

        updateCustomerChannelName: function (shopData,data1,channelInfo,msg) {
            var mName = JSON.parse($cookies.get("username")).username.replace(/ /g, '');
            var mDesigner = shopData.username.replace(/ /g, '');

            return productWebServices.updateCustomerChannelName(mName,mDesigner,shopData.id,data1).then(function(data){
                if(data == 0){
                    return sdo.composeMsg(msg,channelInfo.uniqueName).then(function(data){
                        return data;
                    });
                }
            });

        },

        composeMsg: function (msg,data) {

         return twilioWebServices.sendMessageTwilio(msg,data).then(function(data){
             console.log("product Services composeMsg",data);
            return data;
         });
        }

    }
    return sdo;

}]);