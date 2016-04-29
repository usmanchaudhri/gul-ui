app.controller('cartCtrl',['$scope','$cookieStore','$http','Base64','$window','$location','$rootScope','$timeout', function($scope,$cookieStore,$http,Base64,$window,$location,$rootScope,$timeout) {
			$scope.isNumber = angular.isNumber;
			$scope.totalPrice = 0;
			$scope.qty = 0;
			$scope.showContent = false;
			
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.fixPath = response.data.fixImagePath;
					$scope.token = response.data.token;
					$scope.orderUrl = response.data.orderUrl;
					$scope.paypalClientID = response.data.paypalClientID;
					$scope.paypalSecretKey = response.data.paypalSecretKey;
					$scope.paypalToken = response.data.paypalToken;
					$scope.paypalPaymentUrl = response.data.paypalPayment;
					//	checkUrl();
				
				});
			$rootScope.$on("CallParentMethod", function(){
					$timeout(function() {
							$scope.showContent = true;
						}, 1500);
			 	
				});
				
				$rootScope.$on("addToBag", function(event,args){
						console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA");
						$scope.storeProductsInCookie(args.data.prod,args.data.size,args.data.qty);
				}); 
			var checkUrl = function(){
				var urlParameters = $location.search();
				if(angular.isDefined(urlParameters.paymentId)){
					var tokenID = $cookieStore.get("tokenID");
					$cookieStore.remove("tokenID");
					//	$http.defaults.headers.common['Authorization'] = 'Bearer ' + tokenID;
					console.log(tokenID);
					var config = {
						headers : {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tokenID
							
						}
					};
				
					console.log("PAYER ID: "+urlParameters.PayerID);
					var data = {
						"payer_id" : urlParameters.PayerID
					}
					$http.post(
						$scope.paypalPaymentUrl+'/'+urlParameters.paymentId+'/execute/',  data,config
					).success(function(data, status) {
							console.log(data);
							//console.log(data.links[1].href);
							//			$window.location.href = data.links[1].href;
								
						}).error(function (data, status) {
							console.log(data);
						});
				}
			}
			
			$scope.items = $cookieStore.get("invoices",$scope.invoices);
			
			$scope.getItemSize = function(){
				if(angular.isDefined($scope.items)){
					$scope.items = $cookieStore.get("invoices",$scope.invoices);
					if($scope.abc <= 0 ){
						$scope.itemSize = true;
					}else{
						$scope.itemSize = false;
					} 
				}else{
					$scope.itemSize = true;
				}
				console.log($scope.itemSize);
			}

		
			/*$scope.proceedCheckout = function(){
				
				$window.alert("Please Login First!");
			}*/
				
			var paypalData = $.param({
					grant_type : "client_credentials"
				});
			
			$scope.paypalPayment = function(){
				
				if($cookieStore.get("username") != null){
				if($scope.totalPrice > 0){
					$scope.loadingData = true;
					$scope.prepareCall();
					var base64 = Base64.encode( $scope.paypalClientID + ':' + $scope.paypalSecretKey );
				
					var config = {
						headers : {
							'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
							'Authorization': 'Basic ' + base64
						}
					}
					var data = $.param({
							grant_type : "client_credentials"
						});
			
					$http.post(
						$scope.paypalToken,  data,config
					).success(function(data, status) {
							$cookieStore.put("tokenID",data.access_token);
							var tokenID = $cookieStore.get("tokenID");
					
							//		$http.defaults.headers.common['Authorization'] = data.token_type+' ' + tokenID;
							var config = {
								headers : {
									'Content-Type': 'application/json',
									'Authorization': data.token_type+' ' + tokenID
								}
							}
				
							$http.post(
								$scope.paypalPaymentUrl,  paypalPayload(),config
							).success(function(data, status) {
									console.log(data);
									console.log(data.links[1].href);
									$window.location.href = data.links[1].href;
								}).error(function (data, status) {
									if(data != null){
										$scope.loadingData = false;
										$scope.dataError = data;
									}else{
										$scope.dataError = "Check Your Internet Connection And Try Again! ";
									}
									console.log(data);
								});
							console.log(data);
						}).error(function (data, status) {
							if(data != null){
								$scope.dataError = data;
							}else{
								$scope.dataError = "Check Your Internet Connection And Try Again! ";
							}
					
							console.log(data);
						});
				}else{
					alert("Card is Empty");
				}
				}else{
					$rootScope.$emit("signin", {});
				}
			}
			
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
				$scope.getItemSize();
			
			};

			$scope.storeProductsInCookie=function(prod,size,qty){
				console.log(size+ "=Size////qty="+qty);
				console.log("Product",prod);
				console.log("Invoices",$cookieStore.get("invoices"));				
				var prodExistFlag = false;
				if(prod.quantity >qty){
				if(qty<1){
					qty = 1;
				}
				if(angular.isDefined($cookieStore.get("invoices"))){
				
					angular.forEach($cookieStore.get("invoices"), function (myProd) {
							if(myProd.id==prod.id && myProd.size == size){
								prodExistFlag = true;
							}
						});
				}
					
				if(prodExistFlag){
							var itemsList = $cookieStore.get("invoices");
						angular.forEach(itemsList, function (myProd) {
							if(myProd.id==prod.id && myProd.size == size){
								console.log("Product Matched");
								myProd.qty = parseInt(myProd.qty) + parseInt(qty);
							}
						});
						$cookieStore.put("invoices",itemsList);
					
				}else{
					console.log("Quantity Check:",qty);
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
				}
					$scope.items = $cookieStore.get("invoices");
						
					$scope.currentItem = $scope.items[$scope.items.length - 1];
				
					console.log("product price",$scope.currentItem.cost);
					console.log("Add Product "+$scope.items.length);
					$scope.abc = $scope.items.length;
					$scope.totalCost($scope.invoice.items);
					$scope.getItemSize();
				}
				
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
				$scope.totalPrice = Math.round($scope.totalPrice * 100) / 100; 
				console.log("CHANGE QTY: " + $scope.qtyModel);
			};
			
			$scope.prepareCall = function(){
				var base64 = Base64.encode( $scope.paypalClientID + ':' + $scope.paypalSecretKey );
				//console.log(base64);
			
				//$http.defaults.headers.common['Authorization'] = 'Basic ' + base64;
			}
			
			var paypalPayload = function(){
				console.log($scope.totalPrice);
				//	$scope.totalPrice = Math.round($scope.totalPrice * 100) / 100;
				return paypalLoad = {
					"intent":"sale",
					"redirect_urls":{
						"return_url":"http://localhost:9000/#/thanku",
						"cancel_url":"http://localhost:9000/#/cancel"
					/*	"return_url":"http://www.gulgs.com/#/thanku",
						"cancel_url":"http://www.gulgs.com/#/cancel"*/
					},
					"payer":{
						"payment_method":"paypal"
					},
					"transactions":[
						{
							"amount":{
								"total":$scope.totalPrice,
								"currency":"USD",
								"details":{
									"subtotal":$scope.totalPrice,
									"tax":"0.00",
									"shipping":"0.00"
								}
							},
							"description":"Toatal Transaction Payment is " + $scope.totalPrice
						}
					]
				}
			}
		
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
			
			
			
			$scope.onload = function(){
				$(window).load(function () {
						$("body").fadeIn(100);
					});
				console.log("WINDOW");
			};
			$scope.onload();
			checkItems();
			$scope.getItemSize();
			

		}]);
		

        

