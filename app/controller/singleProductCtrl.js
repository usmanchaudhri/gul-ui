app.controller('singleProCtrl',['$scope','$http','$q','$timeout','$location','$routeParams', function($scope,$http,$q,$timeout,$location,$routeParams) {
   
			$scope.pro_id = $routeParams.proId;
			$scope.prodSize = 0;
			$scope.prodQty = 1;
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.fixPath = response.data.fixImagePath;
					$scope.token = response.data.token;
			
					$http.get(response.data.productUrl + '/' + $scope.pro_id)
					.then(function(response1){
							$scope.productDetail = response1.data;
    	
						});
				});
			
			
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
			
			$scope.load = function() {
		
				$("#itemdetail").click(function(){
						$("#custom-section").css("display","block");
						$(".itemdetail-border").css("border-bottom","2px solid #D25E00");
						$(".customization-border").css("border-bottom","none");
						$(".shipping-border").css("border-bottom","none");
			
					});
				$("#customization").click(function(){
						$("#custom-section").css("display","block");
						$(".itemdetail-border").css("border-bottom","none");
						$(".customization-border").css("border-bottom","2px solid #D25E00");
						$(".shipping-border").css("border-bottom","none");
			
					});
				$("#shipping").click(function(){
						$("#custom-section").css("display","block");
						$(".itemdetail-border").css("border-bottom","none");
						$(".customization-border").css("border-bottom","none");
						$(".shipping-border").css("border-bottom","2px solid #D25E00");
					});
				$('.spinner .btn:first-of-type').on('click', function() {
						var btn = $(this);
						var input = btn.closest('#up').find('input');
						if (input.attr('max') == undefined || parseInt(input.val()) < parseInt(input.attr('max'))) {    
							input.val(parseInt(input.val(), 10) + 1);
						} else {
							btn.next("disabled", true);
						}
					});
				$('.spinner .btn:last-of-type').on('click', function() {
						var btn = $(this);
						var input = btn.closest('#up').find('input');
						if (input.attr('min') == undefined || parseInt(input.val()) > parseInt(input.attr('min'))) {    
							input.val(parseInt(input.val(), 10) - 1);
						} else {
							btn.prev("disabled", true);
						}
					});
		
	
			};
			$scope.load();
		}]);
        
