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
    						$scope.selectedItem = response1.data.productVariation[0].size;
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
			
			/**
			CREATE CHANNEL
			**/
			
				$scope.createChannel = function(){
			var data1 = $.param({
					UniqueName : 'UzairAmjad',
					Type: 'private'
				});			
			
			$http.post(
				$scope.twilioChannel,  data1,config
			).success(function(data, status) {
				console.log(data);
				if(data == ''){
					$scope.retrieveChannel();
				}else{
					$scope.data = data;
					$scope.channelSid = data.sid;
					addMembers();
					
				}
					//console.log($scope.channelSid);
					
				
				
				}).error(function (data, status) {
				
				$scope.retrieveChannel();
				
					console.log("RET Channel");
				});
		}
	
			/**
			Retrieve Channel
			**/
			
				$scope.retrieveChannel = function(){
			console.log("Check");
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
				}
			}
		
			$http.get(
				$scope.twilioChannel+'/UzairAmjad',config
			).success(function(data, status) {
				$scope.channelSid = data.sid;
				addMembers();
				console.log(data.sid);
				}).error(function (data, status) {
					console.log(data);
					console.log("3rd");
				});
				
		}
	
		var addMembers = function(){
			var data2 = $.param({
							Identity : ""
						});
					var data1 = $.param({
							Identity : $cookieStore.get("login")
						});
					var promise1 = $http({
							method: 'POST',
							url: $scope.twilio+$scope.channelSid+'/Members',
							data: data2,
							headers : {
								'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
							},
							cache: 'true'});
					var promise2 = $http({
							method: 'POST',
							url: $scope.twilio+$scope.channelSid+'/Members',
							data: data1,
							headers : {
								'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
							},
							cache: 'true'});

					$q.all([promise1,promise2]).then(function(data){
							console.log(data[0],data[1]);
						}, function onError(response) {
							console.log(response);
						});
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
        
