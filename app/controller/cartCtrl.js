app.controller('cartCtrl',['$scope','$cookieStore','$http', function($scope,$cookieStore,$http) {
			$scope.isNumber = angular.isNumber;
			$scope.totalPrice = 0;
			$scope.qty = 0;
		
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.fixPath = response.data.fixImagePath;
					$scope.token = response.data.token;
					$scope.orderUrl = response.data.orderUrl;
				});
	
			$scope.items = $cookieStore.get("invoices",$scope.invoices);
		
	
			var checkItems = function(){
				if(angular.isUndefined($scope.items)){
					$scope.invoice = {
						items: []
					};
					$scope.abc = 0;
				}
				else{
					$scope.invoice = {
						items: $cookieStore.get("invoices",$scope.invoices)
					};
					$scope.abc = $scope.items.length;
			
					$scope.totalCost($scope.invoice.items);
				}
			}
		
			$scope.removeItem = function(index) {
				console.log(index);
				$scope.invoice.items.splice(index, 1);
			
				//$cookieStore.remove("invoices");
				$cookieStore.put("invoices",$scope.invoice.items);
				$scope.items = [];
				$scope.items = $cookieStore.get("invoices",$scope.invoices);
				$scope.totalCost($scope.invoice.items);
				$scope.abc = $scope.items.length;
				console.log("Remove Method "+$scope.items.length);
			
			};

			$scope.storeProductsInCookie=function(prod,size,qty){
				console.log(prod);
				$scope.invoice.items.push({
						id:prod.id,
						qty: qty,
						totalQty: prod.quantity,
						name:prod.name,
						size: size,
						shop: prod.shop.name,
						shopID: prod.shop.id,
						cost: prod.pricingProduct.storedValue,
						category: prod.category,
						imagePath: prod.imagePath
					
					});
				$cookieStore.put("invoices",$scope.invoice.items);
				$scope.items = $cookieStore.get("invoices",$scope.invoices);
				console.log("Add Product "+$scope.items.length);
				$scope.abc = $scope.items.length;
				$scope.totalCost($scope.invoice.items);

			};
	
			$scope.totalCost = function(items) {
				console.log("TOTAL COST: " + items.length);
				$scope.totalPrice = 0;
				for(var i =0; i< items.length ;i++){
					$scope.totalPrice = $scope.totalPrice + (items[i].cost*items[i].qty);
					console.log("Len: " + $scope.totalPrice);
				}
				if(items.length == 0){
					$scope.totalPrice = 0;
				}
				console.log("CHANGE QTY: " + $scope.qtyModel);

				
			};
			
			
			$scope.uploadOrder=function(){
				$scope.showProgress = true;
				var count = -1;
				var config = {
					headers : {
						'Content-Type': 'application/json'
					}
				}
				//	console.log($scope.proUpload());
			
				for(var i = 0;i<$scope.items.length;i++){
			
					$http.post(
						$scope.orderUrl, $scope.orderPayload($scope.items[i]),config
					).success(function(data, status) {
							console.log(data);
							$scope.newProId = data.id;
						}).error(function (data, status) {
							console.log(data);
							console.log(status);
						});
				}
			};
			$scope.orderPayload = function(itemDetail){
				
				return payload ={
					"productId": itemDetail.id,
					"productName": itemDetail.name,
					"productSku": "Birds Han",
					"productQuantity": itemDetail.qty,
					"productPrice": itemDetail.cost,
					"productImagePath": "/listing",
					"productCategoryId": itemDetail.category.id,
					"productShopId": itemDetail.shopID,
					"customer": {
						"id": "4"
					}
				}
			}
			
			/**
 * Paypal checkout. Reacts on /paypal/set-express-checkout
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
/*function paypalCheckout(orderData, req, res) {{
    var cancelUrl = req.body.cancelUrl;
    var successUrl = req.body.successUrl;

    var paypal = PayPal.create(GLOBAL.config.paypal.apiUsername, GLOBAL.config.paypal.apiPassword, GLOBAL.config.paypal.signature, GLOBAL.config.paypal.sandbox);
    paypal.setPayOptions(GLOBAL.config.paypal.brandName, null, GLOBAL.config.paypal.logoUrl);

    var paypalItems = _.map(orderData.products, function(item) {
        return {
            name: item.name,
            description: item.description,
            quantity: item.userOptions.quantity,
            amount: item.price,
        };
    });

    paypal.setProducts(paypalItems);

    paypal.setExpressCheckoutPayment(
        orderData.email, 
        orderData.orderId, 
        orderData.totalDiscountedPrice, 
        '', 
        'USD', 
        successUrl, 
        cancelUrl, 
        false,
        function(err, data) {
            if (err) {
                logger.error('paypal seting express checkout payment failed.', err);
                res.status(500).send('Error setting paypal payment');
                return;
            }

            GLOBAL.dbConnection.query('INSERT INTO paypal_order_data (token, order_data) VALUES (?, ?)', [data.token, JSON.stringify(orderData)], function(err) {
                if (err) {
                    logger.error('Storing paypal_order_data for orderId: %s with token: %s', orderData.orderId, data.token);
                    return res.status(500).send('Error setting paypal payment. Failed storing order data.');
                }

                res.send({ redirectUrl: redirectUrl });
            });
    });
}
*/			
			checkItems();
			
			

		}]);
        

