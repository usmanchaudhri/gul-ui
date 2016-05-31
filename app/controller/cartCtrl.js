app.controller('cartCtrl', ['$scope', '$cookies', '$http', '$rootScope', '$timeout', 'gulServiceCall','cartFactory','commonFactory', function ($scope, $cookies, $http, $rootScope, $timeout, gulServiceCall,cartFactory,commonFactory) {
    $scope.isNumber = angular.isNumber;
    $scope.totalPrice = 0;
    $scope.qty = 0;
    $scope.showContent = false;
    $scope.popFlag = false;


    /**
     * getting Cart Item From Cookies
     */

    if($cookies.get("invoices")!= null){
        $scope.items = JSON.parse($cookies.get("invoices"));
    }


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
        $scope.totalCost(JSON.parse($cookies.get("invoices")));
    });


    /**
     * Getting Item size to show products in  Cart of menu on hover
     */
    $scope.getItemSize = function () {
            if(angular.isDefined($scope.items)){
                $scope.items = JSON.parse($cookies.get("invoices"));
                if($scope.abc <= 0 ){
                    $scope.itemSize = true;
                }else{
                    $scope.itemSize = false;
                }
            }else{
                $scope.itemSize = true;
            }
    }

    /**
     * Paypal Payment Api calling
     */
    $scope.paypalPayment = function () {

        cartFactory.paypalPayment().then(function(data){
            console.log(data);
        });
    };

    /**
     * Checking for total Items in Cart
     */
    var checkItems = function () {
        cartFactory.checkItems().then(function(data){
            $scope.abc = data.abc;
            $scope.totalPrice = data.totalPrice;
            $scope.items = data.items;
            console.log("checkItems: ",data);
        });
    }

    /**
     * Remove item from Cart
     * @param index
     */
    $scope.removeItem = function (index) {
        $scope.items.splice(index, 1);
        $cookies.put("invoices", JSON.stringify($scope.items));
        $scope.items = [];
        $scope.items = JSON.parse($cookies.get("invoices"));
        $scope.totalCost($scope.items);
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
        cartFactory.storeProductsInCookie(prod,size,qty).then(function(data){
            $scope.abc = data.abc;
            $scope.totalPrice = data.totalPrice;
            $scope.currentItem = data.currentItem;
            $scope.items = data.invoice;
        });
    };

    /**
     * Calculating total cost of products in cart
     * @param items
     */
    $scope.totalCost = function (items) {
        cartFactory.totalCost(items).then(function (data) {
            $scope.totalPrice = data;

        });
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
		

        

