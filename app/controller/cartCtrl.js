app.controller('cartCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$timeout', 'gulServiceCall', function ($scope, $cookieStore, $http, $rootScope, $timeout, gulServiceCall) {
    $scope.isNumber = angular.isNumber;
    $scope.totalPrice = 0;
    $scope.qty = 0;
    $scope.showContent = false;
    $scope.popFlag = false;

    /**
     * getting Cart Item From Cookies
     */

    $scope.items = $cookieStore.get("invoices", $scope.invoices);

    /**
     * CAll Service Method getUrls to get all urls from .properties file
     * @type {*|{local: string, external: string}}
     */

    var getUrls = gulServiceCall.getUrls();
    getUrls.then(function (response) {
        $scope.fixPath = response.data.fixImagePath;
        $scope.token = response.data.token;
        $scope.mUrls = response.data;

    });

    /**
     * Time out view display for 1 sec
     */
    $rootScope.$on("CallParentMethod", function () {
        $timeout(function () {
            $scope.showContent = true;
        }, 1000);

    });


    $rootScope.$on("addToBag", function (event, args) {
        $scope.storeProductsInCookie(args.data.prod, args.data.size, args.data.qty);
        $scope.totalCost($cookieStore.get("invoices"));
    });


    /**
     * Getting Item size to show products in  Cart of menu on hover
     */

    $scope.getItemSize = function () {
        if (angular.isDefined($scope.items)) {
            $scope.items = $cookieStore.get("invoices", $scope.invoices);
            if ($scope.abc <= 0) {
                $scope.itemSize = true;
            } else {
                $scope.itemSize = false;
            }
        } else {
            $scope.itemSize = true;
        }
    }

    /**
     * Paypal Payment Api calling
     */

    $scope.paypalPayment = function () {
        if ($cookieStore.get("username") != null) {
            if ($scope.totalPrice > 0) {
                $scope.loadingData = true;
                gulServiceCall.paypalApi($scope.mUrls, paypalPayload()).then(function (response) {
                    console.log(response);
                });
            } else {
                alert("Card is Empty");
            }
        } else {
            $rootScope.$emit("signin", {});
        }
    };

    /**
     * Checking for total Items in Cart
     */

    var checkItems = function () {
        if (angular.isUndefined($scope.items)) {
            $scope.invoice = {
                items: []
            };
            $scope.abc = 0;
        }
        else {
            $scope.invoice = {
                items: $cookieStore.get("invoices", $scope.invoices)
            };
            $scope.abc = $scope.items.length;

            $scope.totalCost($scope.invoice.items);
        }
    }

    /**
     * Remove item from Cart
     * @param index
     */

    $scope.removeItem = function (index) {
        $scope.invoice.items.splice(index, 1);
        $cookieStore.put("invoices", $scope.invoice.items);
        $scope.items = [];
        $scope.items = $cookieStore.get("invoices", $scope.invoices);
        $scope.totalCost($scope.invoice.items);
        $scope.abc = $scope.items.length;
        $scope.getItemSize();

    };

    /**
     * Store product in cart
     * @param prod
     * @param size
     * @param qty
     */

    $scope.storeProductsInCookie = function (prod, size, qty) {
        $scope.popFlag = true;
        var prodExistFlag = false;
        if (prod.quantity > qty) {
            if (qty < 1) {
                qty = 1;
            }
            if (angular.isDefined($cookieStore.get("invoices"))) {
                angular.forEach($cookieStore.get("invoices"), function (myProd) {
                    if (myProd.id == prod.id && myProd.size == size) {
                        prodExistFlag = true;
                    }
                });
            }
            if (prodExistFlag) {
                var itemsList = $cookieStore.get("invoices");
                var i = 0;
                angular.forEach(itemsList, function (myProd) {
                    if (myProd.id == prod.id && myProd.size == size) {
                        myProd.qty = parseInt(myProd.qty) + parseInt(qty);
                        itemsList.splice(i, 1, myProd);
                        $scope.totalCost(itemsList);
                    }
                    i++;
                });
                $cookieStore.put("invoices", itemsList);

            } else {
                console.log("Quantity Check:", qty);
                $scope.invoice.items.push({
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

                $cookieStore.put("invoices", $scope.invoice.items);
            }
            $scope.items = $cookieStore.get("invoices");

            $scope.currentItem = $scope.items[$scope.items.length - 1];

            /*console.log("product price",$scope.currentItem.cost);
             console.log("Add Product "+$scope.items.length);*/
            $scope.abc = $scope.items.length;
            $scope.totalCost($scope.items);
            $scope.getItemSize();
        } else {
            //	$scope.inStock=false;
            //	$scope.outOfStock=true;
        }

    };

    /**
     * Calculating total cost of products in cart
     * @param items
     */

    $scope.totalCost = function (items) {
        $scope.totalPrice = 0;
        for (var i = 0; i < items.length; i++) {
            $scope.totalPrice = $scope.totalPrice + (items[i].cost * items[i].qty);
        }
        if (items.length == 0) {
            $scope.totalPrice = 0;
        }
        $scope.totalPrice = Math.round($scope.totalPrice * 100) / 100;
    };

    /**
     * Payload Structure for Paypal
     * @returns {{intent: string, redirect_urls: {return_url: string, cancel_url: string}, payer: {payment_method: string}, transactions: *[]}}
     */

    var paypalPayload = function () {
        return paypalLoad = {
            "intent": "sale",
            "redirect_urls": {
                "return_url":"http://localhost:9000/#/thanku",
                 "cancel_url":"http://localhost:9000/#/cancel"
                /*"return_url": "http://www.gulgs.com/#/thanku",
                "cancel_url": "http://www.gulgs.com/#/cancel"*/
            },
            "payer": {
                "payment_method": "paypal"
            },
            "transactions": [
                {
                    "amount": {
                        "total": $scope.totalPrice,
                        "currency": "USD",
                        "details": {
                            "subtotal": $scope.totalPrice,
                            "tax": "0.00",
                            "shipping": "0.00"
                        }
                    },
                    "description": "Toatal Transaction Payment is " + $scope.totalPrice
                }
            ]
        }
    }

    /**
     * Method to call on load
     */

    $scope.onload = function () {
        $(window).load(function () {
            $("body").fadeIn(100);
        });
    };

    /**
     * Method call on Controller load
     */

    $scope.onload();
    checkItems();
    $scope.getItemSize();


}]);
		

        

