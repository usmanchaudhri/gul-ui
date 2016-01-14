
app.controller('cartCtrl', function($scope,$cookieStore) {
	
	
		items = $cookieStore.get("invoices",$scope.invoices);
		if(angular.isUndefined(items)){
			$scope.invoice = {
				items: []
			};
			$scope.abc = 0;
		}else{
			$scope.invoice = {
				items: $cookieStore.get("invoices",$scope.invoices)
			};
			$scope.abc = items.length;
		}
		$scope.removeItem = function(index) {
			$scope.invoice.items.splice(index, 1);
			
		};

		$scope.storeProductsInCookie=function(id,price,size,qty){
			$scope.invoice.items.push({
					id:id,
					qty: qty,
					size: size,
					cost: price
				});
			$cookieStore.put("invoices",$scope.invoice.items);
			items = $cookieStore.get("invoices",$scope.invoices);
			$scope.abc = items.length;

		};
			$scope.foo = function(){
	$scope.abc = "AMJAD ISLAM";
		console.log($scope.abc);
	};	


	
		/*$scope.getProductsInCookie=function(){
		items =  $cookieStore.get("invoices",$scope.invoices);
		console.log(items);
  
		};*/
    
	});
        

