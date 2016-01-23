app.controller('singleProCtrl', function($scope,$http,$q,$timeout,$location,$routeParams) {
   
		$scope.pro_id = $routeParams.proId;
		$scope.prodSize = 1;
		$scope.prodQty = 0;
		$http.get("url.properties")
		.then(function(response) {
				$scope.fixPath = response.data.fixImagePath;
				$scope.token = response.data.token;
			
				$http.get(response.data.productUrl + '/' + $scope.pro_id)
				.then(function(response1){
						$scope.productDetail = response1.data;
    	
					});
			});
			
			
			
			
		$scope.load = function() {
			$('.spinner .btn:first-of-type').on('click', function() {
					var btn = $(this);
					var input = btn.closest('#one').find('input');
					if (input.attr('max') == undefined || parseInt(input.val()) < parseInt(input.attr('max'))) {    
						input.val(parseInt(input.val(), 10) + 1);
					} else {
						btn.next("disabled", true);
					}
				});
			$('.spinner .btn:last-of-type').on('click', function() {
					var btn = $(this);
					var input = btn.closest('#one').find('input');
					if (input.attr('min') == undefined || parseInt(input.val()) > parseInt(input.attr('min'))) {    
						input.val(parseInt(input.val(), 10) - 1);
					} else {
						btn.prev("disabled", true);
					}
				});

			$('.spinner .btn:first-of-type').on('click', function() {
					var btn = $(this);
					var input = btn.closest('#two').find('input');
					if (input.attr('max') == undefined || parseInt(input.val()) < parseInt(input.attr('max'))) {    
						input.val(parseInt(input.val(), 10) + 1);
					} else {
						btn.next("disabled", true);
					}
				});
			$('.spinner .btn:last-of-type').on('click', function() {
					var btn = $(this);
					var input = btn.closest('#two').find('input');
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
	});
        
