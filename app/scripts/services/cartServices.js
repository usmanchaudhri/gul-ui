/**
 * Created by Khan on 6/2/2016.
 */
app.factory('cartServices', ['$cookies', '$rootScope', 'restServices', '$q', function ($cookies, $rootScope, restServices, $q) {
    var sdo = {

        /**
         * we pass total items in cart as a paramter to this method and it calculate total price of items
         * @param items
         * @returns {*}
         */
        cartItemsTotalPrice: function (items) {
            var deferred = $q.defer();
            var totalPrice = 0;
            for (var i = 0; i < items.length; i++) {
                totalPrice = totalPrice + (items[i].cost * items[i].qty);
            }
            if (items.length == 0) {
                totalPrice = 0;
            }
            totalPrice = Math.round(totalPrice * 100) / 100;
            deferred.resolve(totalPrice);
            return deferred.promise;
        },

        /**
         * we pass product information, size and quantity to this method as parameter,
         * it check if product quantity and size is same and product already exist in
         * list just increase already exist product quantity otherwise add product in
         * cookies and cart.
         * @param prod
         * @param size
         * @param qty
         * @returns {*}
         */
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
                    return sdo.cartItemsTotalPrice(invoice).then(function (data) {
                        console.log("cartItemsTotalPrice");
                         value = {
                            "result": "product Added",
                            "currentItem": invoice[invoice.length - 1],
                            "noOfCartItems": invoice.length,
                            "totalPrice": data,
                            "invoice": invoice
                        };

                        return value;
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

        /**
         * This method give us all information related to cart. it fetch data from
         * cookies and complete items data, totla no of items and price.
         * @returns {*}
         */
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

        /**
         * this method take cart items and total number of cart items and tell us
         * there is any product in cart or not .
         * @param items
         * @param noOfCartItems
         * @returns {*}
         */
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