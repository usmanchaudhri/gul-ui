/**
 * Created by Khan on 6/2/2016.
 */
app.factory('cartFactory', ['$cookies', '$rootScope', 'apiFactory', '$q','cfpLoadingBar', function ($cookies, $rootScope, apiFactory, $q,cfpLoadingBar) {
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
            cfpLoadingBar.start();
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
            //console.log("LATEST LOG: ",$cookies.get("invoices"));
            var invoice = [];
            var prodExistFlag = false;
            if (prod.quantity > qty) {
                if (qty < 1) {
                    qty = 1;
                }
                if (angular.isDefined($cookies.get("invoices"))) {
                    var invoice = JSON.parse($cookies.get("invoices"));

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
            var items = $cookies.get("invoices");
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
        },

        getItemSize: function(items,abc){
            var deferred = $q.defer();
            if(angular.isDefined(items)){
                if(abc <= 0 ){
                    deferred.resolve(true);
                }else{
                    deferred.resolve(false);
                }
            }else{
                deferred.resolve(true);
            }
            return deferred.promise;
        }

    }


    return sdo;
}]);