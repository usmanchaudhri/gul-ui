app.factory('Base64', function() {
		var keyStr = 'ABCDEFGHIJKLMNOP' +
		'QRSTUVWXYZabcdef' +
		'ghijklmnopqrstuv' +
		'wxyz0123456789+/' +
		'=';
		return {
			encode: function (input) {
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;

				do {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);

					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;

					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}

					output = output +
					keyStr.charAt(enc1) +
					keyStr.charAt(enc2) +
					keyStr.charAt(enc3) +
					keyStr.charAt(enc4);
					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";
				} while (i < input.length);

				return output;
			},

			decode: function (input) {
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;

				// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
				var base64test = /[^A-Za-z0-9\+\/\=]/g;
				if (base64test.exec(input)) {
					alert("There were invalid base64 characters in the input text.\n" +
						"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
						"Expect errors in decoding.");
				}
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

				do {
					enc1 = keyStr.indexOf(input.charAt(i++));
					enc2 = keyStr.indexOf(input.charAt(i++));
					enc3 = keyStr.indexOf(input.charAt(i++));
					enc4 = keyStr.indexOf(input.charAt(i++));

					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;

					output = output + String.fromCharCode(chr1);

					if (enc3 != 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) {
						output = output + String.fromCharCode(chr3);
					}

					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";

				} while (i < input.length);

				return output;
			}
		};
	});
app.factory('DataLoader', function( $http ) {
 
		return {
			post: function(url) {
				return $http.jsonp( url );
			},
			getAuth: function(base64, url,postData) {
				console.log(postData);
				$http.defaults.headers.common['Authorization'] = 'Basic ' + base64;
 
				var req = { 
					method: 'POST', 
					url: url,
					data: postData
      
				}
 
				return $http( req );
			},
		}
	});
app.factory('gulServices', ['$http','$q','$timeout','$cookies','Base64', function($http,$q,$timeout,$cookies,Base64) {
			var sdo = {
				/**
				List of cchat
				**/
				
				getChat: function() {
					var deferred = $q.defer();
					
					
					
					return $http.get('gulgs.properties')
					.then(function(one) {
							
							console.log('Promise one resolved with ', one);
							var anotherDeferred = $q.defer();
							var cChatNames = [];
							var config = {
								headers : {
									'Content-Type': 'application/json'
								}
							}
							
							//$http.get(one.data.customerUrl+'/'+$cookies.get('userId')+'/cchat',)
							return $http.get(one.data.customerUrl+'/'+$cookies.get('userId')+'/cchat').then(function(dataa) {
									console.log('Promise sdo resolved with ', dataa);
							
							
									var	customerName = JSON.parse($cookies.get("username")).username;
								
									if(dataa.data.length > 0){
										console.log(dataa);
									
										var chatArr = dataa.data[0].customer.cchat;
										for(var i = 0;i< chatArr.length;i++){
											
										//	var name = chatArr[i].shopOwnerUsername.split("@"); 
											
											//	var conversation = getConversationCustom(chatArr[i].uniqueName,$q,$http);
											var promise = getConversationCustom(chatArr[i],$q,$http);
											console.log("Promise is : ",promise);
											promise.then(function(data) {
													
													console.log("Success : ",i);
													
													
												//	cName.lastMessage = lastMsg;
													cChatNames.push(data);
													
													console.log("lastMsg : ",data);
												}, function(reason) {
										
													console.log("Success : ",data);
												});
											//
											console.log("custom conversation array",promise);
										//	console.log("Updated Value of User",cName);
											
											//console.log("Last Message",lastMsg);
										
											/*var cName = {
												"uniqueName": chatArr[i].uniqueName,
												"product": chatArr[i].customerUsername,
												"designer": name[0]
												//,"lastMessage": lastMsg 
												
											}*/
											//cChatNames.push(cName);
										}
									}
									return cChatNames
								});
						
						});
				},
				
				
				/*List of Conversation*/
				getConversation: function(chatNames) {
					var deferred = $q.defer();
					var chatTitle = '';
					var promise = $http({
							method: 'GET',
							url: 'gulgs.properties',
							cache: 'false'});
					
					return promise
					.then(function(one) {
							
							console.log('Promise one resolved with ', one);
							var anotherDeferred = $q.defer();
							var cChatNames = [];
							var config = {
								headers : {
									'Content-Type': 'application/json'
								}
							}
							
							
							return $http.get(one.data.customerUrl+'/'+$cookies.get('userId')+'/cchat').then(function(dataa) {
												
									console.log("Channel DATA: ",dataa);
									
									for(var i = 0;i < dataa.data.length ; i++){
										if(dataa.data[i].uniqueName == chatNames){
											var	designerName = JSON.parse($cookies.get("username")).username.split('@');
											var from = dataa.data[i].shopOwnerUsername.split('@');
											chatTitle = {
												"customerUsername": dataa.data[i].customerUsername,
												"customer": designerName[0],
												"designer": from[0]
											};
										}
									}
							
									return	$http.get(
										one.data.twilioChannel+'/'+chatNames+'/Messages',config
									).then(function(data, status) {
											console.log("SSID",data);
											var chatData = [];
													
											for(var i = 0;i<data.data.length ; i++){
														
												var from = data.data[i].from.split('@');
												var value = {
													"from": from[0],
													"body":	data.data[i].body
												}
												chatData.push(value);
											}
													
												
													
											return {
												"chatData": chatData,
												"cchat": chatTitle
												
											};
						
										});
								});
										
						});
				},
				
	
				getShippingList: function(){
					var deferred = $q.defer();
					var promise = $http({
							method: 'GET',
							url: 'gulgs.properties',
							cache: 'false'});
					return promise
					.then(function(response) {
							var base64 = Base64.encode( $cookies.get("username").username + ':' + $cookies.get("username").password );

							var loginAuth =  base64;
							var config = {
								headers : {
									'Content-Type': 'application/json',
									'Authorization': 'Basic ' + loginAuth
								}
							}
						
							return	$http.get(response.data.customerUrl +'/' + $cookies.get("userId") + "/cchat" , config)
							.then(function(response1){
									/*$scope.showProgress = true;*/
									console.log("Services Response",response1);
				  
									return response1.data[0].customer.customerShipping;
							
				
								});
						
						
						
						});
				},
	
				/*List of Orders*/
				getOrder: function(){
					var deferred = $q.defer();
					var promise = $http({
							method: 'GET',
							url: 'gulgs.properties',
							cache: 'false'});
					return promise
					.then(function(response) {
							var base64 = Base64.encode( $cookies.get("username").username + ':' + $cookies.get("username").password );

							var loginAuth =  base64;
							var config = {
								headers : {
									'Content-Type': 'application/json',
									'Authorization': 'Basic ' + loginAuth
								}
							}
						
							return	$http.get(response.data.customerUrl +'/' + $cookies.get("userId") + "/orders" , config)
							.then(function(response1){
									/*$scope.showProgress = true;*/
									console.log("Services Response",response1);
				  
					
						
									value = {
							
										orderDetail: response1.data,
							
									};
						
									return value;
							
				
								});
						
						
						
						});
				},
				
				/**
				Get ALL SHOPS
				**/
				getallShops: function() {
					var deferred = $q.defer();
					
					var promise = $http({
							method: 'GET',
							url: 'gulgs.properties',
							cache: 'true'});
					
					return promise
					.then(function(response) {
							var mFixPath = response.data.fixImagePath;
							var	mToken = response.data.token;
							//deferred.resolve();
						
							var anotherPromise = $http({
									method: 'GET',
									url: response.data.shopUrl,
									cache: 'true'});
									
							return anotherPromise
							.then(function(response1){
									//
									value = {
										allShopDetail: response1.data,
										fixPath:mFixPath,
										token:mToken
									};
									console.log(value);	
									return value;
									//return allShopDetail = response1.data;
								});	
				
						
						
						});
    
    
				},

				/**
				GET SPECIFIC SHOP
				**/
				getShop: function(shop_id) {
					var deferred = $q.defer();
					var promise = $http({
							method: 'GET',
							url: 'gulgs.properties',
							cache: 'true'});
					console.log("PARAMS",shop_id);
					return promise
					.then(function(response) {
							var mFixPath = response.data.fixImagePath;
							var	mToken = response.data.token;
							//deferred.resolve();
							var promise1 = $http({method: 'GET', url: response.data.shopUrl+'/'+shop_id+'/products', cache: 'true'});
							var promise2 = $http({method: 'GET', url: response.data.shopUrl+'/'+shop_id+'/designers', cache: 'true'});
				
							return	$q.all([promise1, promise2]).then(function(data){
					
									value = {
										fixPath:mFixPath,
										token:mToken,
										shop: data[0].data,
										designer:data[1].data
									};
									return value;
								});
						
						
						
						});
    
    
				},

				/**
				GET PRODUCT DETAIL
				**/
				getProductDetail: function(pro_id) {
					var deferred = $q.defer();
					var promise = $http({
							method: 'GET',
							url: 'gulgs.properties',
							cache: 'true'});
					return promise
					.then(function(response) {
							var mFixPath = response.data.fixImagePath;
							var	mToken = response.data.token;
							//deferred.resolve();
							return	$http.get(response.data.productUrl + '/' + pro_id)
							.then(function(response1){
									value = {
										urls:response.data,
										fixPath:mFixPath,
										token:mToken,
										productDetail: response1.data,
										selectedItem: response1.data.productVariation[0].size
									};
									console.log("PRoduct Detail: ",value);
									return value;
							
				
								});
						
						
						
						});
    
    
				},
     
				getCategory: function(cat_id) {
					var deferred = $q.defer();
					var promise = $http({
							method: 'GET',
							url: 'gulgs.properties',
							cache: 'true'});
					return promise
					.then(function(response) {
							var mFixPath = response.data.fixImagePath;
							var	mToken = response.data.token;
							//deferred.resolve();
							return	$http.get(response.data.categoryUrl + '/' + cat_id)
							.then(function(response1){
									value = {
										urls:response.data,
										fixPath:mFixPath,
										token:mToken,
										categoryLength: response1.data.subCategories.length,
										categoryDetail: response1.data
									};
									return value;
								});
						
						
						
						});
    
    
				},
  			   
				getCategoryProduct: function(cat_id) {
					var deferred = $q.defer();
					var promise = $http({
							method: 'GET',
							url: 'gulgs.properties',
							cache: 'true'});
					return promise
					.then(function(response) {
							var mFixPath = response.data.fixImagePath;
							var	mToken = response.data.token;
							//deferred.resolve();
							return	$http.get(response.data.categoryUrl + '/' + cat_id + '/products')
							.then(function(response1){
									var categoryIDs = [];
									categoryProDetail = [];
									var data = response1.data.products;
									var dataLength = data.length;
									for(var i=0;i<dataLength;i++){
										var shopName = '';
										if(angular.isObject(data[i].shop)){
											shopName = data[i].shop.name;
											var value = {
												"id": data[i].shop.id,
												"name": data[i].shop.name
											};
											categoryIDs.push(value);
										}else{
											shopName = data[i].shop;
								
										}
										var value = {
											"name": data[i].name,
											"id": data[i].id,
											"shortDesc": data[i].shortDesc,
											"longDesc": data[i].longDesc,
											"quantity": data[i].quantity,
											"pricingProduct": data[i].pricingProduct,
											"category": {
												"id": data[i].category.id,
												"code": data[i].category.code,
												"name": data[i].category.name,
												"createdOn": data[i].category.createdOn,
											},
											"shop": shopName,
											"productVariation": data[i].productVariation,
											"attributeDefinitions": data[i].attributeDefinitions,
											"imageInfo": data[i].imageInfo,
											"createdOn": data[i].createdOn
										};
										categoryProDetail.push(value);
										data = data[i].category.products;
									}
									value = {
										urls:response.data,
										fixPath:mFixPath,
										token:mToken,
										categoryProDetail: categoryProDetail,
										categoryIDs: categoryIDs
									};
									return value;
							
								});
						
						
						
						});
    
    
				}
     

			}
			
			return sdo;
		}]);

/*
var getConversationCustom = function(chatNames,$q,$http){
	return function() {
		var defer = $q.defer()
		var chatTitle = '';
		var promise = $http({
				method: 'GET',
				url: 'gulgs.properties',
				cache: 'false'});
					
		return promise
		.then(function(one) {
							
				console.log('Promise one resolved with ', one);
				
				var cChatNames = [];
				var config = {
					headers : {
						'Content-Type': 'application/json'
					}
				}
							
							
				return	$http.get(
					one.data.twilioChannel+'/'+chatNames+'/Messages',config
				).then(function(data, status) {
						console.log("SSID",data);
						var chatData = [];
													
						for(var i = 0;i<data.data.length ; i++){
														
							var from = data.data[i].from.split('@');
							var value = {
								"from": from[0],
								"body":	data.data[i].body
							}
							chatData.push(value);
						}
													
												
						console.log("chatData",chatData);	
					//	return {
					//	"chatData": chatData,
					//	"cchat": chatTitle							
					//	};
						var data = {
							"chatData": chatData,
							"cchat": chatTitle
						};
						deferred.resolve(data);
						//return data;
						//return $q.resolve(data);
						//return $q.promise;
						
					});
				//});
										
			});
		return defer.promise
	}
} */
var getConversationCustom = function(obj,$q,$http){
			
				//return function() {
				var chatNames =	obj.uniqueName;
					var deferred = $q.defer();
					var chatTitle = '';
					var promise = $http({
							method: 'GET',
							url: 'gulgs.properties',
							cache: 'false'});
					
					return promise
					.then(function(one) {
							
							console.log('Promise one resolved with ', one);
							var anotherDeferred = $q.defer();
							var cChatNames = [];
							var config = {
								headers : {
									'Content-Type': 'application/json'
								}
							}														
							
									return	$http.get(
										one.data.twilioChannel+'/'+chatNames+'/Messages',config
									).then(function(data, status) {
											console.log("SSID",data);
											var chatData = [];
													
											for(var i = 0;i<data.data.length ; i++){
														
												var from = data.data[i].from.split('@');
												var value = {
													"from": from[0],
													"body":	data.data[i].body
												}
												chatData.push(value);
											}
													
												
												console.log("chatData",chatData);
												var lastMsg = chatData[(chatData.length-1)].body;	
										
											var name = obj.shopOwnerUsername.split("@"); 
											return cName = {
												"uniqueName": obj.uniqueName,
												"product": obj.customerUsername,
												"designer": name[0],
												"lastMessage": lastMsg
												
											}
										});
			
						});
		
				// return deferred.promise
  			//}
		}

