app.controller('singleProCtrl',['$scope','$http','$q','$timeout','$location','$routeParams','$cookies','productDetail','$uibModal', function($scope,$http,$q,$timeout,$location,$routeParams,$cookies,productDetail,$uibModal) {
   

var config = {
	headers : {
		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	}
}
$scope.pro_id = $routeParams.proId;
$scope.prodSize = 0;
var cChatNames = [];
			
	$scope.productQty =1;		
$scope.productDetail = productDetail.productDetail;
$scope.selectedItem = productDetail.selectedItem;
$scope.fixPath = productDetail.fixPath;
$scope.token = productDetail.token;
			
/**
Load URL from File
**/
			
/*$http.get("gulgs.properties")
.then(function(response) {
$scope.fixPath = response.data.fixImagePath;
$scope.token = response.data.token;
$scope.twilioChannel = response.data.twilioChannel;
$scope.customerUrl = response.data.customerUrl;
$scope.shopUrl = response.data.shopUrl;
			
$http.get(response.data.productUrl + '/' + $scope.pro_id)
.then(function(response1){
$scope.productDetail = response1.data;
$scope.selectedItem = response1.data.productVariation[0].size;
getChatList();
getShopOwner();
//$scope.shopName = JSON.parse($cookies.get("username")) + "-" + $scope.shopCustomer.replace(/ /g, '');
});
});*/
			
			
/**
Total Number of images Count
**/
$scope.customerUrl = productDetail.urls.customerUrl;
$scope.twilioChannel = productDetail.urls.twilioChannel;
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
	$scope.shopName = JSON.parse($cookies.get("username")).username + "-" + $scope.shopCustomer.username.replace(/ /g, '');
	console.log("Create Channel: "+ $scope.shopName);
	var data1 = $.param({
			UniqueName : $scope.shopName,
			Type: 'private'
		});	
	$http.post(
		$scope.twilioChannel,  data1,config
	).success(function(data, status) {
			console.log(data);
			if(data == ''){
				retrieveChannel();
			}else{
				$scope.data = data;
				$scope.channelSid = data.sid;
							
				addMembers();
					
			}
				
		}).error(function (data, status) {
				
			retrieveChannel();
				
			console.log("RET Channel");
		});
}
	
/**
Retrieve Channel
**/
			
var retrieveChannel = function(){
	console.log("Check");
	var config = {
		headers : {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
		}
	}
		
	
	var shopName = JSON.parse($cookies.get("username")).username + "-" + $scope.shopCustomer.username.replace(/ /g, '');
	$http.get(
		$scope.twilioChannel+'/'+ shopName,config
	).success(function(data, status) {
					
			$scope.channelSid = data.entity.sid;
			var flag = true;
			for(var i = 0; i < cChatNames.length ; i++){
				if($scope.shopCustomer.username == cChatNames[i].name){
					flag = false;
				}
			}
			console.log("Retrive: "+flag);
			if(flag){
				updateCustomer();
			}else{
				composeMsg();
			}
		}).error(function (data, status) {
			console.log(data);
			console.log("3rd");
		});
				
}
	
/**
Add Members
**/
	
var addMembers = function(){
	var mName = JSON.parse($cookies.get("username")).username.replace(/ /g, '');
	var mDesigner = $scope.shopCustomer.username.replace(/ /g, '');
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
						
			//getShopOwner();
			//	composeMsg();
			var flag = true;
			for(var i = 0; i < cChatNames.length ; i++){
				if($scope.shopCustomer.username == cChatNames[i].name){
					flag = false;
				}
			}
			if(flag){
				updateCustomer();
			}else{
				composeMsg();
			}
						
						
		}, function onError(response) {
			console.log(response);
						
		});
}
	
/**
Send Message
**/
		
$scope.sendMessage = function(shopID){
	console.log("Send msg called");
	$scope.shopID = shopID;
	var flag = true;
	for(var i = 0; i < cChatNames.length ; i++){
					
		if($scope.shopCustomer.username == cChatNames[i].name){
			console.log();
			flag = false;
		}
	}
	console.log(flag);
	if(flag){
		createChannel();
	}else{
		retrieveChannel();
	}
				
				
				
}
			
			
/**
Compose Message			
**/
			
var composeMsg = function(){
	var	mFrom = JSON.parse($cookies.get("username")).username.replace(/ /g, '');
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
			

/**
Add Cchat in customer 
**/
			
var updateCustomer = function(){
	var mName = JSON.parse($cookies.get("username")).username.replace(/ /g, '');
	var mDesigner = $scope.shopCustomer.username.replace(/ /g, '');
	console.log("MNAME: "+mName);
	var data1 = {"cchat": [
			{"uniqueName":  mName +"-"+ mDesigner}
		]};
				
	var promise1 = $http({
			method: 'PUT',
			url: $scope.customerUrl+'/'+$scope.shopCustomer.id,
			data: data1,
			headers : {
				'Content-Type': 'application/json'
			},
			cache: 'false'});
	var promise2 = $http({
			method: 'PUT',
			url: $scope.customerUrl+'/'+JSON.parse($cookies.get("username")).id,
			data: data1,
			headers : {
				'Content-Type': 'application/json'
			},
			cache: 'false'});

	$q.all([promise1,promise2]).then(function(data){
			console.log(data[0],data[1]);
					
			composeMsg();
		}, function onError(response) {
			console.log(response);
						
		});
}
		
		
		
/**
Get Customer id to update CCHAT
**/
			
var getShopOwner = function(){
				
	var config = {
		headers : {
			'Content-Type': 'application/json'
		}
	}
	console.log(productDetail.urls.shopUrl+"/"+$scope.productDetail.shop.id+"/shopOwner");
	$http.get(
		productDetail.urls.shopUrl+"/"+$scope.productDetail.shop.id+"/shopOwner",config
	).success(function(data, status) {
			console.log(data);
			$scope.shopCustomer = data;
		}).error(function (data, status) {
			console.log(data);
			console.log(status);
		});
					
				
}
			
/**
get chat list and search channel if already exist;
**/
			
var getChatList = function(){
	var config = {
		headers : {
			'Content-Type': 'application/json'
		}
	}
	//console.log($scope.customerUrl+"/"+JSON.parse($cookies.get("username")).id+"/cchat");
	$http.get(
		productDetail.urls.customerUrl+"/"+JSON.parse($cookies.get("username")).id+"/cchat",config
	).success(function(data, status) {
			var	customerName = JSON.parse(JSON.parse($cookies.get("username"))).username;
						
			if(angular.isDefined(data[0])){
				console.log(data[0].customer);
									
				var chatArr = data[0].customer.cchat;
				for(var i = 0;i< chatArr.length;i++){
					var uName = chatArr[i].uniqueName.split("-");
					if(uName[0] == customerName){
						var cName = {
							"name": uName[1]
						}
					}else{
						var cName = {
							"name": uName[0]
						}
					}
					console.log(cName);
					cChatNames.push(cName);
				}
			}
						
		}).error(function (data, status) {
			console.log(data);
			console.log(status);
		});
}

/*Chat with Designer*/
	
	$scope.open = function(name){
		$scope.animationsEnabled = true;
		$uibModal.open({
              templateUrl: 'myModalContent.html',
              controller: 'modalCtrl', 
               resolve: {
        name: function () {
          return name;
        }
      }
         })
        .result.then(
            function (shopid) {
                $scope.sendMessage(shopid);
            }
            
        );
		}
	/*End of Chat with Designer*/
	
	
			
			
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
				var input = btn.closest('#two').find('input');
				if (input.attr('max') == undefined || parseInt(input.val()) < parseInt(input.attr('max'))) {    
					$(".spinner").focus();
					input.val(parseInt(input.val(), 10) + 1);					
				} else {
					btn.next("disabled", true);
					console.log("else");
				}
			});
		$('.spinner .btn:last-of-type').on('click', function() {
				
				var btn = $(this);
				var input = btn.closest('#two').find('input');
				if (input.attr('min') == undefined || parseInt(input.val()) > parseInt(input.attr('min'))) {    
					input.val(parseInt(input.val(), 10) - 1);
					
					console.log("down"+input.val());
				} else {
					btn.prev("disabled", true);
				}
			});
		
	
	};
	
	$scope.load();
	//getChatList();
	getShopOwner();
}]);

 