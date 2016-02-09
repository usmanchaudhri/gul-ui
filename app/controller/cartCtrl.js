
app.controller('cartCtrl', function($scope,$cookieStore,$http) {
		$scope.isNumber = angular.isNumber;
		$http.get("gulgs.properties")
		.then(function(response) {
				$scope.fixPath = response.data.fixImagePath;
				$scope.token = response.data.token;
			});
		$scope.qty = 0;
		$scope.items = $cookieStore.get("invoices",$scope.invoices);
		if(angular.isUndefined($scope.items)){
			$scope.invoice = {
				items: []
			};
			$scope.abc = 0;
		}else{
			$scope.invoice = {
				items: $cookieStore.get("invoices",$scope.invoices)
			};
			$scope.abc = $scope.items.length;
		}
		
		$scope.submitOrder = function(){
			
			
			
			
		}
		
		$scope.removeItem = function(index) {
			$scope.invoice.items.splice(index, 1);
			
		};

		$scope.storeProductsInCookie=function(prod,size,qty){
			if(!$scope.isNumber(prod.shop.id))
			mShop = prod.shop;
			else
			mShop = prod.shop.name;
			
			var numDrop = [];
			for(var i = 1; i<=prod.quantity; i++){
				var value = {
					id: i
				};
				
				numDrop.push(value);
			}
					  
			$scope.invoice.items.push({
					id:prod.id,
					qty: qty,
					totalQty: prod.quantity,
					name:prod.name,
					size: size,
					shop: mShop,
					cost: prod.pricingProduct.storedValue,
					imagePath: prod.imageInfo.imagePath,
					dropObj: numDrop
				});
			$cookieStore.put("invoices",$scope.invoice.items);
			items = $cookieStore.get("invoices",$scope.invoices);
			$scope.abc = items.length;

		};
	
	
	$scope.cartItem = function(product){
				
				return proPayload =  "productId":,
  "productName": "Birds Hands Tee",
  "productSku": "Birds Han",
  "productQuantity": "1",
  "productPrice": "100",
  "productImagePath": "/listing",
  "productCategoryId": "8",
  "productShopId": "1",
  "customer": {
    "id": "4"
  }
			}
	});
        

