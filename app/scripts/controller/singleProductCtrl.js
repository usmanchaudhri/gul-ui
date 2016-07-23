app.controller('singleProCtrl',['$scope','$http','$q','$timeout','$location','$routeParams','$cookies','productDetail','$uibModal','Base64','$rootScope', function($scope,$http,$q,$timeout,$location,$routeParams,$cookies,productDetail,$uibModal,Base64,$rootScope) {


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
	 Compose Message
	 **/









	/**
	 Get Customer id to update CCHAT
	 **/



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
		//call here add product to cookies
		//storeProductsInCookie(productDetail,selectedItem,productQty)
		//$rootScope.$on.storeProductsInCookie(prod,price,qty);
		var data = {
			"prod":prod,
			"size":size,
			"qty":qty
		};
		$rootScope.$emit("addToBag",{"data":data});
	}


	$scope.load();
	//getChatList();
	getProductShopDetail();
}]);
