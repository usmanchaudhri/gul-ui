app.factory('Base64', function () {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});

/* TODO */
app.factory('DataLoader', function ($http) {
    return {
        post: function (url) {
            return $http.jsonp(url);
        },
        getAuth: function (base64, url, postData) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + base64;
            var req = {
                method: 'POST',
                url: url,
                data: postData
            }
            return $http(req);
        },
    }
});

app.factory('gulServices', ['$q', '$timeout', '$cookies', 'Base64', 'gulServiceCall', 'apiFactory', 'chatFactory','commonFactory', function ($q, $timeout, $cookies, Base64, gulServiceCall, apiFactory, chatFactory , commonFactory) {
    var sdo = {

        /**
         List of cchat
         **/
        getChat: function () {
            return $http.get('gulgs.properties')
                .then(function (one) {
                    var cChatNames = [];
                    return $http.get(one.data.customerUrl + '/' + JSON.parse($cookies.get('username')).id + '/cchat').then(function (dataa) {
                        var customerName = JSON.parse($cookies.get("username")).username;
                        if (dataa.data.length > 0) {
                            var chatArr = dataa.data[0].customer.cchat;
                            for (var i = 0; i < chatArr.length; i++) {
                                var promise = getConversationCustom(chatArr[i], $q, $http);
                                promise.then(function (data) {
                                    cChatNames.push(data);
                                }, function (reason) {
                                    console.log("Success : ", reason);
                                });
                            }
                        }
                        return cChatNames
                    });

                });
        },


        /*List of Conversation*/
        getConversation: function (chatNames) {
            var deferred = $q.defer();
            return gulServiceCall.getUrls()
                .then(function (one) {

                    return gulServiceCall.getMessageTitle(one, chatNames)
                        .then(function (chatTitle) {

                            return gulServiceCall.retrieveMessageTwilio(chatNames)
                                .then(function (data) {
                                    return {
                                        "chatData": data,
                                        "cchat": chatTitle

                                    };
                                });
                        });
                });
        },


        /**
         * Get list of all shipping address of user
         * @returns {*}
         */
        getShippingList: function () {

            return gulServiceCall.getUrls()
                .then(function (response) {
                    var url = response.data.loginUrl;
                    return apiFactory.getApiAuthData(url)
                        .then(function (response1) {
                            return response1.data.customerShipping;
                        });
                });
        },

        /**
         * Get list of all orders placed by user
         * @returns {*}
         */
        getOrder: function () {
            return gulServiceCall.getUrls()
                .then(function (response) {
                    var url = response.data.customerUrl + '/' + $cookies.get("userId") + "/orders";
                    return apiFactory.getApiAuthData(url)
                        .then(function (response1) {
                            value = {
                                orderDetail: response1.data,
                            };
                            return value;
                        });
                });
        },

        /**
         * Get Account Detail of user
         * @returns {*}
         */
        getAccount: function () {
            return gulServiceCall.getUrls()
                .then(function (response) {
                    var url = response.data.loginUrl;
                    return apiFactory.getApiAuthData(url)
                        .then(function (response1) {
                            return response1.data;
                        });
                });
        },

        /**
         * Get All shop exist
         * @returns {*}
         */
        getallShops: function () {

            return gulServiceCall.getUrls()
                .then(function (response) {
                    var url = response.data.shopUrl;
                    return apiFactory.getApiData(url)
                        .then(function (response1) {
                            value = {
                                allShopDetail: response1.data,
                                fixPath: response.data.fixImagePathShop,
                                token: response.data.token
                            };
                            return value;
                        });
                });
        },

        /**
         GET SPECIFIC SHOP on which user click
         **/

        getShop: function (shop_id) {
            return gulServiceCall.getUrls()
                .then(function (response) {
                    return apiFactory.getShop(shop_id).then(function (data) {
                        var value =
                        {
                            fixPath: response.data.fixImagePath,
                            fixPathShop: response.data.fixImagePathShop,
                            token: response.data.token,
                            shop: data[0].data,
                            designer: data[1].data
                        };
                        return value;
                    });
                });
        },

        /**
         GET PRODUCT DETAIL
         **/
        getProductDetail: function (pro_id) {

            return gulServiceCall.getUrls()
                .then(function (response) {
                    var url = response.data.productUrl + '/' + pro_id;
                    return apiFactory.getApiData(url)
                        .then(function (data) {
                            value = {
                                urls: response.data,
                                fixPath: response.data.fixImagePath,
                                token: response.data.token,
                                productDetail: data.data,
                                selectedItem: data.data.productVariation[0].size
                            };
                            console.log("PRoduct Detail: ", value);
                            return value;
                        });
                });
        },

        getCategory: function (cat_id) {
            gulServiceCall.getUrls()
                .then(function (response) {
                    var url = response.data.categoryUrl + '/' + cat_id;
                    return apiFactory.getApiData(url)
                        .then(function (data) {
                            return commonFactory.isImage(mFixPath + 'category/banner_' + cat_id + '.jpg' + mToken, $q).then(function (result) {
                                value = {
                                    urls: response.data,
                                    banner: result,
                                    fixPath: response.data.fixImagePath,
                                    token: response.data.token,
                                    categoryLength: data.data.subCategories.length,
                                    categoryDetail: data.data
                                };
                                return value;
                            });
                        });
                });
        },

        getCategoryProduct: function (cat_id) {

            gulServiceCall.getUrls()
                .then(function (response) {
                    var url = response.data.categoryUrl + '/' + cat_id + '/products';
                    return apiFactory.getApiData(url)
                        .then(function (response1) {
                            var categoryIDs = [];
                            categoryProDetail = [];
                            var data = response1.data.products;
                            var dataLength = data.length;
                            for (var i = 0; i < dataLength; i++) {
                                var shopName = '';
                                if (angular.isObject(data[i].shop)) {
                                    shopName = data[i].shop.name;
                                    var value = {
                                        "id": data[i].shop.id,
                                        "name": data[i].shop.name
                                    };
                                    categoryIDs.push(value);
                                } else {
                                    shopName = data[i].shop;

                                }
                                var value = {
                                    "name": data[i].name,
                                    "id": data[i].id,
                                    "shortDesc": data[i].shortDesc,
                                    "longDesc": data[i].longDesc,
                                    "quantity": data[i].quantity,
                                    "pricingProduct": data[i].pricingProduct,
                                    "category": {
                                        "id": data[i].category.id,
                                        "code": data[i].category.code,
                                        "name": data[i].category.name,
                                        "createdOn": data[i].category.createdOn,
                                    },
                                    "shop": shopName,
                                    "productVariation": data[i].productVariation,
                                    "attributeDefinitions": data[i].attributeDefinitions,
                                    "imageInfo": data[i].imageInfo,
                                    "createdOn": data[i].createdOn
                                };
                                categoryProDetail.push(value);
                                data = data[i].category.products;
                            }
                            return isImage(mFixPath + 'category/banner_' + cat_id + '.jpg' + mToken, $q).then(function (result) {

                                value = {
                                    banner: result,
                                    urls: response.data,
                                    fixPath: response.data.fixImagePath,
                                    token: response.data.token,
                                    categoryProDetail: categoryProDetail,
                                    categoryIDs: categoryIDs
                                };
                                return value;

                            });


                        });


                });


        },

        /**
         * Adding user New Shipping Address
         * @param customerUrl
         * @param shippingData
         */
        addNewShipping: function (customerUrl, shippingData) {
            apiFactory.postApiAuthData(customerUrl, shippingData)
                .then(function (data) {
                    return sdo.getShippingList().then(function (data) {

                        return data;
                    });
                });
        }

    }
    return sdo;

}]);

app.factory('gulServiceCall', ['$http', '$q', '$timeout', '$cookies', 'Base64', '$window', function ($http, $q, $timeout, $cookies, Base64, $window) {
    var sdo = {

        getUrls: function () {
            return $http.get('gulgs.properties')
                .then(function (one) {
                    // console.log("ONE", one);
                    return one;
                });
        },


        updateShippingAddress: function () {

            sdo.getUrls().then(function (data) {
                var base64 = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
                var loginAuth = base64;
                var config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + loginAuth
                    }
                }
                return $http.put(
                    data.data.shippingUrl + '/' + updateDetail.shippingDetail.id, updateShippingAddress, config
                ).then(function (data) {
                    return $http.get(
                        data.data.loginUrl, config
                    ).then(function (data, status) {
                        return data.data.customerShipping;
                    });
                });
            });

        },

        signIn: function (loginEmail, loginPass) {
            var base64 = Base64.encode(loginEmail + ':' + loginPass);

            var loginAuth = base64;
            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + loginAuth

                }
            }

            return sdo.getUrls().then(function (data) {
                return $http.get(
                    data.data.loginUrl, config
                ).then(function (data) {
                    console.log(data);
                    if ($cookies.get("username") != loginEmail) {
                        var value = {
                            "username": data.data.username,
                            "password": loginPass,
                            "id": data.data.id,
                            "shopId": JSON.stringify(data.data.shop)
                        };
                        $cookies.put("username", JSON.stringify(value));
                        $cookies.put("userId", data.data.id);
                        console.log("VALUE: ", value);
                        return 0;
                    } else {
                        return 1;
                    }

                });
            });

        },

        updateIsActive: function (shippingId1, isActive1, shippingId2, isActive2, customerUrl) {
            var data1 = {
                "isActive": isActive1
            };
            console.log("Data1: ", data1);
            var data2 = {
                "isActive": isActive2
            };
            console.log("Data2: ", JSON.parse($cookies.get("username")));

            var mId = JSON.parse($cookies.get("username")).id;
            var base64 = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
            var loginAuth = base64;

            var promise1 = $http({
                method: 'PUT',
                url: customerUrl + '/' + mId + '/customershipping/' + shippingId1,
                data: data1,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + loginAuth
                },
                cache: 'false'
            });
            var promise2 = $http({
                method: 'PUT',
                url: customerUrl + '/' + mId + '/customershipping/' + shippingId2,
                data: data2,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + loginAuth
                },
                cache: 'false'
            });

            return $q.all([promise1, promise2]).then(function (data) {
                return 1;
            }, function onError(response) {
                return 0;
                console.log("onError", response);

            });
        },

        updateCustomer: function () {

        }
    }

    return sdo;
<<<<<<< HEAD
}]);

app.factory('cartFactory', ['$cookies', '$rootScope', 'gulServiceCall', 'apiFactory', '$q', function ($cookies, $rootScope, gulServiceCall, apiFactory, $q) {
    var sdo = {

        paypalPayment: function (totalPrice, paypalPayload) {

            if ($cookies.get("username") != null) {
                var invoice = JSON.parse($cookies.get("invoices"));
                return sdo.totalCost(invoice).then(function(data){
                    if (data > 0) {
                        return apiFactory.paypalToken(paypalPayload).then(function (data) {
                            $cookies.put("tokenID", data.access_token);
                            var tokenID = $cookies.get("tokenID");
                            return apiFactory.paypalPayment(function (data) {
                                return data;
                            });
                        });

                    } else {
                        alert("Cart is Empty");
                    }
                });
            } else {
                $rootScope.$emit("signin", {});
            }
        },

        uploadOrder: function (orderPayload) {
            apiFactory.getUrls().then(function (response) {
                return apiFactory.postApiAuthData(
                    response.data.orderUrl, orderPayload
                ).then(function (data) {
                    return "success";

                });
            });

        },

        totalCost: function (items) {
            var deferred = $q.defer();
            //var items = $cookies.get("invoices");
            console.log("PRINT PRINT: ", items.length);
            var totalPrice = 0;
            for (var i = 0; i < items.length; i++) {
                //    console.log(items[i]);
                totalPrice = totalPrice + (items[i].cost * items[i].qty);
            }
            if (items.length == 0) {
                totalPrice = 0;
            }
            totalPrice = Math.round(totalPrice * 100) / 100;
            console.log(totalPrice);
            deferred.resolve(totalPrice);
            return deferred.promise;
        },

        storeProductsInCookie: function (prod, size, qty) {
            var deferred = $q.defer();
            var invoice = JSON.parse($cookies.get("invoices"));
            var prodExistFlag = false;
            if (prod.quantity > qty) {
                if (qty < 1) {
                    qty = 1;
                }
                if (angular.isDefined($cookies.get("invoices"))) {
                    angular.forEach(JSON.parse($cookies.get("invoices")), function (myProd) {
                        if (myProd.id == prod.id && myProd.size == size) {
                            prodExistFlag = true;
                        }
                    });
                }
                if (prodExistFlag) {
                    var itemsList = JSON.parse($cookies.get("invoices"));
                    var i = 0;
                    angular.forEach(itemsList, function (myProd) {
                        if (myProd.id == prod.id && myProd.size == size) {
                            myProd.qty = parseInt(myProd.qty) + parseInt(qty);
                            itemsList.splice(i, 1, myProd);
                        }
                        i++;
                    });
                    $cookies.put("invoices", JSON.stringify(itemsList));
                } else {
                    invoice.push({
                        id: prod.id,
                        qty: qty,
                        totalQty: prod.quantity,
                        name: prod.name,
                        size: size,
                        shop: prod.shop.name,
                        shopID: prod.shop.id,
                        cost: prod.pricingProduct.storedValue,
                        category: prod.category,
                        imagePath: prod.imagePath

                    });
                    $cookies.put("invoices", JSON.stringify(invoice));
                }
                invoice = JSON.parse($cookies.get("invoices"));
                sdo.totalCost(invoice).then(function (data) {
                    var value = {
                        "currentItem": invoice[invoice.length - 1],
                        "abc": invoice.length,
                        "totalPrice": data,
                        "invoice": invoice
                    };
                    deferred.resolve(value);
                    return deferred.promise;
                });
            }
            return deferred.promise;
        },

        checkItems: function () {
            var deferred = $q.defer();
            var abc;
            var items = JSON.parse($cookies.get("invoices"));
            if (angular.isUndefined(items)) {
                items = [];
                abc = 0;
            }
            else {
                items = JSON.parse($cookies.get("invoices"))
                abc = items.length;
            }
            return sdo.totalCost(items).then(function (data) {
                var value = {
                    "items": items,
                    "abc": abc,
                    "totalPrice": data
                }
                deferred.resolve(value);
                return deferred.promise;
            });
        }

    }


    return sdo;
}]);

app.factory('loginFactory', ['$cookies', '$rootScope', 'apiFactory', function ($cookies, $rootScope, apiFactory) {

    var sdo = {
        regUserTwilio: function (user) {
            var data = $.param({
                Identity: user
            });
            apiFactory.getUrls().then(function (response) {
                var url = response.data.twilioUser;
                apiFactory.postTwilioData(url, data)
                    .then(function (data) {
                        return data;
                    });
            });
        }
    }
    return sdo;
}]);

app.factory('chatFactory', ['apiFactory', '$cookies', function (apiFactory, $cookies) {
    var sdo = {

        /**
         * Get List of user and first msg of chat to show
         * @returns {*|{get}}
         */
        getChatList: function () {
            return apiFactory.getUrls()
                .then(function (one) {
                    var url = one.data.customerUrl + '/' + JSON.parse($cookies.get('username')).id + '/cchat';
                    return apiFactory.getApiData(url)
                        .then(function (dataa) {
                            var cChatNames = [];
                            var customerName = JSON.parse($cookies.get("username")).username;
                            if (dataa.data.length > 0) {
                                var chatArr = dataa.data[0].customer.cchat;
                                for (var i = 0; i < chatArr.length; i++) {
                                    var promise = sdo.getConversationCustom(chatArr[i]);
                                    promise.then(function (data) {
                                        cChatNames.push(data);
                                    }, function (reason) {
                                        console.log("Success : ", reason);
                                    });
                                }
                            }
                            return cChatNames
                        });
                });
        },

        /**
         * Getting Chat Title and call a method to get Messages list
         * @param chatNames
         * @returns {*|{get}}
         */
        getConversationList: function (chatNames) {
            return apiFactory.getUrls()
                .then(function (one) {
                    return sdo.getMessageTitle(one, chatNames)
                        .then(function (chatTitle) {
                            return sdo.retrieveMessageTwilio(chatNames)
                                .then(function (data) {
                                    return {
                                        "chatData": data,
                                        "cchat": chatTitle

                                    };

                                });
                        });
                });
        },

        /**
         * Getting Messages list from server
         * @param channelSid
         * @returns {*|{get}}
         */
        retrieveMessageTwilio: function (channelSid) {
            var chatData = [];
            return apiFactory.getUrls().then(function (response) {
                var url = response.data.twilioChannel + '/' + channelSid + '/Messages';

                console.log("retrieveMessageTwilio", response);
                return apiFactory.getApiData(url)
                    .then(function (data) {
                        var chatMsg = data.data;
                        for (var i = 0; i < chatMsg.length; i++) {
                            var from = chatMsg[i].from.split('@');
                            var value = {
                                "from": from[0],
                                "body": chatMsg[i].body
                            }
                            chatData.push(value);
                        }
                        return chatData;
                    });
            });
        },

        /**
         * Getting Message Title
         * @param one
         * @param chatNames
         * @returns {*}
         */
        getMessageTitle: function (one, chatNames) {
            var url = one.data.customerUrl + '/' + $cookies.get('userId') + '/cchat';
            var chatTitle = '';

            return apiFactory.getApiData(url).then(function (dataa) {
                for (var i = 0; i < dataa.data.length; i++) {
                    if (dataa.data[i].uniqueName == chatNames) {
                        var designerName = JSON.parse($cookies.get("username")).username.split('@');
                        var from = dataa.data[i].shopOwnerUsername.split('@');
                        chatTitle = {
                            "customerUsername": dataa.data[i].customerUsername,
                            "customer": designerName[0],
                            "designer": from[0]
                        };
                    }
                }
                return chatTitle;

            });

        },

        /**
         * Method to get Last message of every chat
         * @param obj
         * @returns {*|{get}}
         */
        getConversationCustom: function (obj) {
            var chatNames = obj.uniqueName;
            return apiFactory.getUrls()
                .then(function (one) {
                    var url = one.data.twilioChannel + '/' + chatNames + '/Messages';
                    return apiFactory.getApiData(url)
                        .then(function (data) {
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
                            return cName = {
                                "uniqueName": obj.uniqueName,
                                "product": obj.customerUsername,
                                "designer": name[0],
                                "lastMessage": lastMsg
                            }
                        });
                });
        },

        /**
         * Send User Message to Server
         * @param msgBody
         * @param channelSid
         * @returns {*}
         */
        sendMessageTwilio: function (msgBody, channelSid) {

            return apiFactory.getUrls().then(function (response) {
                var mFrom = JSON.parse($cookies.get("username")).username.replace(/ /g, '');
                var data1 = $.param({
                    Body: msgBody,
                    From: mFrom
                });
                var url = response.data.twilioChannel + '/' + channelSid + '/Messages';
                return apiFactory.postTwilioData(url, data1)
                    .then(function (data) {
                        return data;
                    });
            });
        },
    }
    return sdo;
}]);

app.factory('commonFactory', ['$q', function ($q) {
    var sdo = {
        isImage: function (src) {
            var deferred = $q.defer();

            var image = new Image();
            image.onerror = function () {
                deferred.resolve(false);
            };
            image.onload = function () {
                deferred.resolve(true);
            };
            image.src = src;

            return deferred.promise;
        },

        menuColor: function (breadcrumbs) {
            var deferred = $q.defer();
            var breadcrumbLength = breadcrumbs.get().length;
            if (breadcrumbLength > 1) {
                var value = {
                    "enableBorder": "1px solid #E2E2E2",
                    "menuColor": "black",
                    "menuMargin": "125px"
                }
                deferred.resolve(value);

            } else {
                var value = {
                    "enableBorder": "none",
                    "menuColor": "white",
                    "menuMargin": "0px"
                }
                deferred.resolve(value);
            }
            console.log("CALLED");
            return deferred.promise;
        },

        getShop: function(mName,categoryIDs){
            for (var i = 0; i < categoryIDs.length; i++) {
                if (mName == categoryIDs[i].name) {
                    return categoryIDs[i].id;
                }
            }
        }

    }
    return sdo;
}]);

// <<<<<<< HEAD
// var isImage = function (src, $q) {
//     var deferred = $q.defer();
//     var image = new Image();
//     image.onerror = function () {
//         deferred.resolve(false);
//     };
//     image.onload = function () {
//         deferred.resolve(true);
//     };
//     image.src = src;

//     return deferred.promise;
// }
// var getConversationCustom = function (obj, $q, $http) {
//     var chatNames = obj.uniqueName;
//     var promise = $http({
//         method: 'GET',
//         url: 'gulgs.properties',
//         cache: 'false'
//     });

//     return promise
//         .then(function (one) {
// =======

app.factory('apiFactory', ['$http', '$q', '$cookies', 'Base64', '$window', function ($http, $q, $cookies, Base64, $window) {
    var sdo = {

        getUrls: function () {
            return $http.get('gulgs.properties')
                .then(function (one) {
                    // console.log("ONE", one);
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
                    return data;
                });
            });
        }


    }

    return sdo;
}]);
=======
}]);
>>>>>>> ui-code-clean
