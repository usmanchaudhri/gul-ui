app.controller('singleProCtrl',['$scope','$http','$q','$timeout','$location','$routeParams','$cookieStore', function($scope,$http,$q,$timeout,$location,$routeParams,$cookieStore) {
   
   
   var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			}
			$scope.pro_id = $routeParams.proId;
			$scope.prodSize = 0;
			$scope.prodQty = 1;
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.fixPath = response.data.fixImagePath;
					$scope.token = response.data.token;
					$scope.twilioChannel = response.data.twilioChannel;
			
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
			
			var createChannel = function(){
			
			var shopName = $cookieStore.get("username") + "-" + $scope.productDetail.shop.name.replace(/ /g, '');
			console.log(shopName);
				var data1 = $.param({
						UniqueName : shopName,
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
		
	var shopName = $cookieStore.get("username") + "-" + $scope.productDetail.shop.name.replace(/ /g, '');
			
				$http.get(
					$scope.twilioChannel+'/'+shopName,config
				).success(function(data, status) {
					
						$scope.channelSid = data.entity.sid;
						composeMsg();
						//addMembers();
						console.log(data);
					}).error(function (data, status) {
						console.log(data);
						console.log("3rd");
					});
				
			}
	
			/**
			Add Members
			**/
	
			var addMembers = function(){
				var mName = $cookieStore.get("username").replace(/ /g, '');
				var mDesigner = $scope.productDetail.shop.name.replace(/ /g, '');
				var data2 = $.param({
						Identity : mDesigner
					});
					 
				var data1 = $.param({
						Identity : mName
					});
				var promise1 = $http({
						method: 'POST',
						url: $scope.twilioChannel+'/'+$scope.channelSid+'/Members',
						data: data2,
						headers : {
							'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
						},
						cache: 'true'});
				var promise2 = $http({
						method: 'POST',
						url: $scope.twilioChannel+'/'+$scope.channelSid+'/Members',
						data: data1,
						headers : {
							'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
						},
						cache: 'true'});

				$q.all([promise1,promise2]).then(function(data){
						console.log(data[0],data[1]);
						composeMsg();
						
						updateCustomer();
						
					}, function onError(response) {
						console.log(response);
					});
			}
	
			/**
			Send Message
			**/
		
			$scope.sendMessage = function(){
				
				createChannel();
				$scope.dismiss();
				
				
			}
			
			
			/**
			Compose Message			
			**/
			
			var composeMsg = function(){
			var	mFrom = $cookieStore.get("username").replace(/ /g, '');
				var data1 = $.param({
					Body : $scope.productDetail.name+","+$scope.msgBody,
					From : mFrom
				});
				$scope.msgBody = "";
			$http.post(
				$scope.twilioChannel+'/'+$scope.channelSid+'/Messages',  data1,config
			).success(function(data, status) {
				console.log(data);
				
				}).error(function (data, status) {
					console.log(data);
				});
				
			}
			
			var updateCustomer = function(){
				
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
        
