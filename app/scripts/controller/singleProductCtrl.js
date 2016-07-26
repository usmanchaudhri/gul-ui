app.controller('singleProductCtrl',['$scope','$http','$q','$timeout','$location','$routeParams','$cookies','productDetail','$uibModal','Base64','$rootScope','productServices', function($scope,$http,$q,$timeout,$location,$routeParams,$cookies,productDetail,$uibModal,Base64,$rootScope,productServices) {


	var config = {
		headers : {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		}
	};
	$scope.pro_id = $routeParams.proId;
	$scope.prodSize = 0;
	var cChatNames = [];
	$scope.imgNumber = 1;
	$scope.productQty =1;
	$scope.productDetail = productDetail.productDetail;
	$scope.selectedItem = productDetail.selectedItem;
	$scope.fixPath = productDetail.fixPath;
	$scope.fixPathShop = productDetail.fixPathShop;
	$scope.token = productDetail.token;

	$scope.customerUrl = productDetail.urls.customerUrl;
	$scope.twilioChannel = productDetail.urls.twilioChannel;
	$scope.readMore = 180;
	$scope.readBtn = "READ MORE";
	$scope.getNumber = function(num) {

		if(angular.isDefined(num)){
			//console.log(new Array(parseInt(num)));
			return new Array(parseInt(num));
		}
	}



	/**
	 Retrieve Channel
	 **/

	/*var retrieveChannel = function(){
		console.log("Check");
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
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
				updateCustomerChannelName();
			}else{
				composeMsg();
			}
		}).error(function (data, status) {
			console.log(data);
			console.log("3rd");
		});

	}

*/
	/**
	 Send Message
	 **/

	$scope.sendMessage = function(msg){
		$scope.msgBody = msg;
		productServices.contactProductDesigner($scope.productDetail.name,$scope.productDetail,msg).then(function(data){
			console.log(data);
		});
	}



	$scope.setReadMore = function () {
		if($scope.readMore == 180){
			$scope.readMore = 1500;
			$scope.readBtn = "READ LESS";
		}else{
			$scope.readMore = 180;
			$scope.readBtn = "READ MORE";
		}

	}


	/*Chat with Designer*/

	$scope.open = function(name){

		if($cookies.get("username") != null){
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
					function (msg) {
						$scope.sendMessage(msg);
					}

			);
		}else{
			$rootScope.$emit("signin", {});
		}
	}
	/*End of Chat with Designer*/


	$scope.setImage = function(num){
		$scope.imgNumber = num+1;
	};



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
	$scope.addToCart = function(prod,size,qty){
		var data = {
			"prod":prod,
			"size":size,
			"qty":qty
		};
		$rootScope.$emit("addToBag",{"data":data});
	}
	$scope.load();
	}]);
