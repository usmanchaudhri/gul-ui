
app.controller('cartCtrl', function($scope,$cookieStore,$http) {
		$scope.isNumber = angular.isNumber;
		$scope.totalPrice = 0;
		$scope.qty = 0;
		
		$http.get("gulgs.properties")
		.then(function(response) {
				$scope.fixPath = response.data.fixImagePath;
				$scope.token = response.data.token;
			});
	
		$scope.items = $cookieStore.get("invoices",$scope.invoices);
		
		$scope.totalCost = function(items) {
			console.log("Length: " + items.length);
			for(var i =0; i< items.length ;i++){
				$scope.totalPrice = $scope.totalPrice + items[i].cost;
				console.log("Len: " + $scope.totalPrice);
			}

				
		};
		
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
			
			$scope.totalCost($scope.invoice.items);
		}
		$scope.removeItem = function(index) {
			$scope.invoice.items.splice(index, 1);
			
		};

		$scope.storeProductsInCookie=function(prod,size,qty){
			$scope.invoice.items.push({
					id:prod.id,
					qty: qty,
					totalQty: prod.quantity,
					name:prod.name,
					size: size,
					shop: prod.shop.name,
					shopID: prod.shop.id,
					cost: prod.price,
					category: prod.category,
					imagePath: prod.imagePath
					
				});
			$cookieStore.put("invoices",$scope.invoice.items);
			items = $cookieStore.get("invoices",$scope.invoices);
			$scope.abc = items.length;

		};
	
		  
		  

	});
        

