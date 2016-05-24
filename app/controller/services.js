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
app.factory('gulServices', ['$http', '$q', '$timeout', '$cookies', 'Base64', 'gulServiceCall', function ($http, $q, $timeout, $cookies, Base64, gulServiceCall) {

    var sdo = {

        /**
         List of cchat
         **/
        getChatList: function () {

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

        /**
         * Get list of converation to show title and last message.
         * @param chatNames
         * @returns {*|{get}}
         */
        getConversationList: function (chatNames) {
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
            var promise = $http({
                method: 'GET',
                url: 'gulgs.properties',
                cache: 'false'
            });
            return promise
                .then(function (response) {
                    var base64 = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
                    var loginAuth = base64;
                    var config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + loginAuth
                        }
                    }

                    return $http.get(response.data.loginUrl, config)
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
            var deferred = $q.defer();
            var promise = $http({
                method: 'GET',
                url: 'gulgs.properties',
                cache: 'false'
            });
            return promise
                .then(function (response) {
                    var loginAuth = Base64.encode($cookies.get("username").username + ':' + $cookies.get("username").password);
                    var config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + loginAuth
                        }
                    }
                    return $http.get(response.data.customerUrl + '/' + $cookies.get("userId") + "/orders", config)
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
            var deferred = $q.defer();
            var promise = $http({
                method: 'GET',
                url: 'gulgs.properties',
                cache: 'false'
            });
            return promise
                .then(function (response) {
                    var loginAuth = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
                    var config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + loginAuth
                        }
                    }
                    return $http.get(response.data.loginUrl, config)
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
            var promise = $http({
                method: 'GET',
                url: 'gulgs.properties',
                cache: 'true'
            });
            return promise
                .then(function (response) {
                    var mFixPath = response.data.fixImagePathShop;
                    var mToken = response.data.token;
                    var anotherPromise = $http({
                        method: 'GET',
                        url: response.data.shopUrl,
                        cache: 'true'
                    });
                    return anotherPromise
                        .then(function (response1) {
                            value = {
                                allShopDetail: response1.data,
                                fixPath: mFixPath,
                                token: mToken
                            };
                            return value;
                        });
                });
        },

        /**
         GET SPECIFIC SHOP on which user click
         **/

        getShop: function (shop_id) {
            var deferred = $q.defer();
            var promise = $http({
                method: 'GET',
                url: 'gulgs.properties',
                cache: 'true'
            });
            console.log("PARAMS", shop_id);
            return promise
                .then(function (response) {
                    var mFixPathShop = response.data.fixImagePathShop;
                    var mFixPath = response.data.fixImagePath;
                    var mToken = response.data.token;
                    //deferred.resolve();
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
                        value = {
                            fixPath: mFixPath,
                            fixPathShop: mFixPathShop,
                            token: mToken,
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
            var deferred = $q.defer();
            var promise = $http({
                method: 'GET',
                url: 'gulgs.properties',
                cache: 'true'
            });
            return promise
                .then(function (response) {
                    var mFixPath = response.data.fixImagePath;
                    var mToken = response.data.token;
                    return $http.get(response.data.productUrl + '/' + pro_id)
                        .then(function (response1) {
                            value = {
                                urls: response.data,
                                fixPath: mFixPath,
                                token: mToken,
                                productDetail: response1.data,
                                selectedItem: response1.data.productVariation[0].size
                            };
                            console.log("PRoduct Detail: ", value);
                            return value;
                        });
                });
        },

        getCategory: function (cat_id) {
            var deferred = $q.defer();
            var promise = $http({
                method: 'GET',
                url: 'gulgs.properties',
                cache: 'true'
            });
            return promise
                .then(function (response) {
                    var mFixPath = response.data.fixImagePath;
                    var mToken = response.data.token;
                    //deferred.resolve();
                    return $http.get(response.data.categoryUrl + '/' + cat_id)
                        .then(function (response1) {
                            return isImage(mFixPath + 'category/banner_' + cat_id + '.jpg' + mToken, $q).then(function (result) {

                                value = {
                                    urls: response.data,
                                    banner: result,
                                    fixPath: mFixPath,
                                    token: mToken,
                                    categoryLength: response1.data.subCategories.length,
                                    categoryDetail: response1.data
                                };
                                return value;
                            });

                        });


                });


        },

        getCategoryProduct: function (cat_id) {
            var deferred = $q.defer();
            var promise = $http({
                method: 'GET',
                url: 'gulgs.properties',
                cache: 'true'
            });
            return promise
                .then(function (response) {
                    var mFixPath = response.data.fixImagePath;
                    var mToken = response.data.token;
                    //deferred.resolve();
                    return $http.get(response.data.categoryUrl + '/' + cat_id + '/products')
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
                                    fixPath: mFixPath,
                                    token: mToken,
                                    categoryProDetail: categoryProDetail,
                                    categoryIDs: categoryIDs
                                };
                                return value;

                            });


                        });


                });


        },

        addNewShipping: function (customerUrl, shippingData) {
            var loginAuth = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + loginAuth
                }
            }
            return $http.post(
                customerUrl + '/' + JSON.parse($cookies.get("username")).id + '/customershipping', shippingData, config
            ).then(function (data) {
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

        paypalApi: function (mUrls, paypalPayloads) {
            if ($cookieStore.get("username") != null) {
                if ($scope.totalPrice > 0) {
                    var base64 = Base64.encode(mUrls.paypalClientID + ':' + mUrls.paypalSecretKey);

                    var config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                            'Authorization': 'Basic ' + base64
                        }
                    }

                    var data = $.param({
                        grant_type: "client_credentials"
                    });

                    return $http.post(
                        mUrls.paypalToken, data, config
                    ).success(function (data, status) {
                        $cookies.put("tokenID", data.access_token);
                        var tokenID = $cookies.get("tokenID");
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
                } else {
                    alert("Cart is Empty");
                }
            } else {
                $rootScope.$emit("signin", {});
            }

        },

        regUserTwilio: function (user) {

            var data = $.param({
                Identity: user
            });
            sdo.getUrls().then(function (response) {

                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };
                return $http.post(
                    response.data.twilioUser, data, config
                ).success(function (data, status) {
                    return data;
                }).error(function (data, status) {
                    console.log(data);
                });
            });

        },

        sendMessageTwilio: function (msgBody, channelSid) {

            return sdo.getUrls().then(function (response) {
                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                }

                var mFrom = JSON.parse($cookies.get("username")).username.replace(/ /g, '');
                var data1 = $.param({
                    Body: msgBody,
                    From: mFrom
                });
                return $http.post(
                    response.data.twilioChannel + '/' + channelSid + '/Messages', data1, config
                ).then(function (data) {
                    console.log("POST DATA: ", data);
                    return data;
                    /*return sdo.retrieveMessageTwilio(channelSid).then(function (dataaa){
                     console.log("retrieveMessageTwilio",dataaa);
                     // return data;
                     });*/
                });

            });
        },

        retrieveMessageTwilio: function (channelSid) {
            var chatData = [];
            return sdo.getUrls().then(function (response) {
                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                }
                return $http.get(
                    response.data.twilioChannel + '/' + channelSid + '/Messages', config
                ).then(function (data) {
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

        getMessageTitle: function (one, chatNames) {
            var chatTitle = '';
            return $http.get(one.data.customerUrl + '/' + $cookies.get('userId') + '/cchat').then(function (dataa) {
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

        uploadOrder: function (orderPayload) {
            var base64 = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
            var loginAuth = base64;
            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + loginAuth
                }
            }
            gulServiceCall.getUrls().then(function (response) {
                return $http.post(
                    response.data.orderUrl, orderPayload, config
                ).then(function (data) {
                    return "success";

                });
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
}]);

app.factory('cartFactory', ['$http', '$q', '$timeout', '$cookies', 'Base64', '$window', '$rootScope', 'gulServiceCall', function ($http, $q, $timeout, $cookies, Base64, $window, $rootScope, gulServiceCall) {
    var sdo = {
        getItemSize: function (items) {
            var deferred = $q.defer();
            if (angular.isDefined(items)) {
                items = $cookies.get("invoices");
                if ($scope.abc <= 0) {
                    deferred.resolve(true);
                } else {
                    deferred.resolve(false);
                }
            } else {
                deferred.resolve(true);
            }
            return deferred.promise;
        },

        paypalPayment: function () {
            if ($cookies.get("username") != null) {
                if (totalPrice > 0) {
                    gulServiceCall.paypalApi(mUrls, paypalPayload()).then(function (response) {
                        console.log(response);
                    });
                } else {
                    alert("Cart is Empty");
                }
            } else {
                $rootScope.$emit("signin", {});
            }
        }

    }


    return sdo;
}]);

app.factory('apiFactory', ['$http', '$q', '$cookies', 'Base64', 'gulServiceCall', function ($http, $q, $cookies, Base64, gulServiceCall) {
    var sdo = {
        categoryApi: function (cat_id) {

            return gulServiceCall.getUrls()
                .then(function (response) {
                    return $http.get(response.data.categoryUrl + '/' + cat_id)
                        .then(function (data) {
                            return data;
                        });
                });
        },

        categoryProductApi: function(){

        }


    }

    return sdo;
}]);


var isImage = function (src, $q) {

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
}
var getConversationCustom = function (obj, $q, $http) {
    var chatNames = obj.uniqueName;
    var promise = $http({
        method: 'GET',
        url: 'gulgs.properties',
        cache: 'false'
    });

    return promise
        .then(function (one) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            return $http.get(
                one.data.twilioChannel + '/' + chatNames + '/Messages', config
            ).then(function (data, status) {
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
}