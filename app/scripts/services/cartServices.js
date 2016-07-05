/**
 * Created by Khan on 6/2/2016.
 */
app.factory('cartServices', ['$cookies', '$rootScope', 'restServices', '$q', function ($cookies, $rootScope, restServices, $q) {
    var sdo = {

        submitPayment: function (totalPrice, payload) {

            if ($cookies.get("username") != null) {
                var invoice = JSON.parse($cookies.get("invoices"));
                return sdo.cartItemsTotalPrice(invoice).then(function(data){
                    if (data > 0) {
                        return restServices.paypalToken(payload).then(function (data) {
                            $cookies.put("tokenID", data.access_token);
                            var tokenID = $cookies.get("tokenID");
                            return restServices.submitPayment(function (data) {
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

        submitOrder: function (orderPayload) {
            return restServices.getUrls().then(function (response) {
                return restServices.postApiAuthData(
                    response.data.orderUrl, orderPayload
                ).then(function (data) {
                    return "success";
                });
            });
        },

        cartItemsTotalPrice: function (items) {
            var deferred = $q.defer();
            console.log("ITEMS : ", items.toString());
            console.log("PRINT PRINT: ", items.length);
            var totalPrice = 0;
            for (var i = 0; i < items.length; i++) {
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
            var value;
            var invoice = [];
            var prodExistFlag = false;
            console.log("Product Quantity: " + prod.quantity);
            if(prod.quantity > 0) {
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
                    sdo.cartItemsTotalPrice(invoice).then(function (data) {
                         value = {
                            "result": "product Added",
                            "currentItem": invoice[invoice.length - 1],
                            "noOfCartItems": invoice.length,
                            "totalPrice": data,
                            "invoice": invoice
                        };

                    });
                } else {
                     value = {
                        "status":1,
                        "result": "Quantity not Available"
                    };
                }
            }else{
                 value = {
                    "status":1,
                    "result": "Stock Not Available"
                };
            }
            console.log(value);
            deferred.resolve(value);
            return deferred.promise;
        },

        getCartInfo: function () {
            var deferred = $q.defer();
            var noOfCartItems;
            var items = $cookies.get("invoices");
            if (angular.isUndefined(items)) {
                items = [];
                noOfCartItems = 0;
            }
            else {
                items = JSON.parse($cookies.get("invoices"))
                noOfCartItems = items.length;
            }
            return sdo.cartItemsTotalPrice(items).then(function (data) {
                var value = {
                    "items": items,
                    "noOfCartItems": noOfCartItems,
                    "totalPrice": data
                }
                deferred.resolve(value);
                return deferred.promise;
            });
        },

        isCartEmpty: function(items,noOfCartItems){
            var deferred = $q.defer();
            if(angular.isDefined(items)){
                if(noOfCartItems <= 0 ){
                    deferred.resolve(true);
                }else{
                    deferred.resolve(false);
                }
            }else{
                deferred.resolve(true);
            }
            console.log("isCart","YES");
            return deferred.promise;
        }
    }
    return sdo;
}]);