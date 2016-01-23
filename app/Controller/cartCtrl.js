
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
			$scope.foo = function(){
	$scope.abc = "AMJAD ISLAM";
		console.log($scope.abc);
	};	

$scope.load = function() {
			$('.spinner .btn:first-of-type').on('click', function() {
					var btn = $(this);
					var input = btn.closest('#cartQty').find('input');
					if (input.attr('max') == undefined || parseInt(input.val()) < parseInt(input.attr('max'))) {    
						input.val(parseInt(input.val(), 10) + 1);
					} else {
						btn.next("disabled", true);
					}
				});
			$('.spinner .btn:last-of-type').on('click', function() {
					var btn = $(this);
					var input = btn.closest('#cartQty').find('input');
					if (input.attr('min') == undefined || parseInt(input.val()) > parseInt(input.attr('min'))) {    
						input.val(parseInt(input.val(), 10) - 1);
					} else {
						btn.prev("disabled", true);
					}
				});

		

			jQuery("#my_styles .btn").click(function(){
					jQuery("#my_styles .btn").removeClass('active');
					jQuery(this).toggleClass('active'); 
				});
		};
		$scope.load();
	
		/*$scope.getProductsInCookie=function(){
		items =  $cookieStore.get("invoices",$scope.invoices);
		console.log(items);
  
		};*/
    
	});
        

