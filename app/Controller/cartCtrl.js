
app.controller('cartCtrl', function($scope,$cookieStore,$http) {
		$scope.isNumber = angular.isNumber;
		$http.get("url.properties")
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
		$scope.removeItem = function(index) {
			$scope.invoice.items.splice(index, 1);
			
		};

		$scope.storeProductsInCookie=function(prod,size,qty){
			if(!$scope.isNumber(prod.shop.id))
			mShop = prod.shop;
			else
			mShop = prod.shop.name;
			$scope.invoice.items.push({
					id:prod.id,
					qty: qty,
					totalQty: prod.quantity,
					name:prod.name,
					size: size,
					shop: mShop,
					cost: prod.pricingProduct.storedValue,
					imagePath: prod.imageInfo.imagePath
				});
			$cookieStore.put("invoices",$scope.invoice.items);
			items = $cookieStore.get("invoices",$scope.invoices);
			$scope.abc = items.length;

		};
	
		$scope.getNumber = function(num) {
			var numDrop = [];
			for(var i = 1; i<=num; i++){
				var value = {
					id: i
				}
				numDrop.push(value);
			}		
			return numDrop;   
		}    
	});
        

