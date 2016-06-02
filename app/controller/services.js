app.factory('Base64', function () {
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

app.factory('DataLoader', function ($http) {

	return {
		post: function (url) {
			return $http.jsonp(url);
		},
		getAuth: function (base64, url, postData) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + base64;

			var req = {
				method: 'POST',
				url: url,
				data: postData

			}

			return $http(req);
		},
	}
});

app.factory('gulServices', ['$q', '$timeout', '$cookies', 'Base64', 'gulServiceCall', 'apiFactory','commonFactory', function ($q, $timeout, $cookies, Base64, gulServiceCall, apiFactory , commonFactory) {

	var sdo = {

		getUrls: function () {
			return $http.get('gulgs.properties')
					.then(function (one) {
						// console.log("ONE", one);
						return one;
					});
		},
		/**
		 * Get list of converation to show title and last message.
		 * @param chatNames
		 * @returns {*|{get}}
		 */


		/**
		 * Get list of all shipping address of user
		 * @returns {*}
		 */
		getShippingList: function () {

			return gulServiceCall.getUrls()
					.then(function (response) {
						var url = response.data.loginUrl;
						return apiFactory.getApiAuthData(url)
								.then(function (response1) {
									return response1.data.customerShipping;
								});
					});
		},

		/**
		 * Get list of all orders placed by user
		 * @returns {*}
		 */
		getOrder: function () {
			return gulServiceCall.getUrls()
					.then(function (response) {
						var url = response.data.customerUrl + '/' + $cookies.get("userId") + "/orders";
						return apiFactory.getApiAuthData(url)
								.then(function (response1) {
									value = {
										orderDetail: response1.data,
									};
									return value;
								});
					});
		},

		/**
		 * Get Account Detail of user
		 * @returns {*}
		 */
		getAccount: function () {
			return gulServiceCall.getUrls()
					.then(function (response) {
						var url = response.data.loginUrl;
						return apiFactory.getApiAuthData(url)
								.then(function (response1) {
									return response1.data;
								});
					});
		},

		/**
		 * Get All shop exist
		 * @returns {*}
		 */
		getallShops: function () {

			return gulServiceCall.getUrls()
					.then(function (response) {
						var url = response.data.shopUrl;
						return apiFactory.getApiData(url)
								.then(function (response1) {
									value = {
										allShopDetail: response1.data,
										fixPath: response.data.fixImagePathShop,
										token: response.data.token
									};
									return value;
								});
					});
		},

		/**
		 GET SPECIFIC SHOP on which user click
		 **/

		getShop: function (shop_id) {
			return gulServiceCall.getUrls()
					.then(function (response) {
						return apiFactory.getShop(shop_id).then(function (data) {
							var value =
							{
								fixPath: response.data.fixImagePath,
								fixPathShop: response.data.fixImagePathShop,
								token: response.data.token,
								shop: data[0].data,
								designer: data[1].data
							};
							return value;
						});
					});
		},

		/**
		 GET PRODUCT DETAIL
		 **/
		getProductDetail: function (pro_id) {

			return gulServiceCall.getUrls()
					.then(function (response) {
						var url = response.data.productUrl + '/' + pro_id;
						return apiFactory.getApiData(url)
								.then(function (data) {
									value = {
										urls: response.data,
										fixPath: response.data.fixImagePath,
										token: response.data.token,
										productDetail: data.data,
										selectedItem: data.data.productVariation[0].size
									};
									console.log("PRoduct Detail: ", value);
									return value;
								});
					});
		},

		getCategory: function (cat_id) {
			gulServiceCall.getUrls()
					.then(function (response) {
						var url = response.data.categoryUrl + '/' + cat_id;
						return apiFactory.getApiData(url)
								.then(function (data) {
									return commonFactory.isImage(mFixPath + 'category/banner_' + cat_id + '.jpg' + mToken, $q).then(function (result) {
										value = {
											urls: response.data,
											banner: result,
											fixPath: response.data.fixImagePath,
											token: response.data.token,
											categoryLength: data.data.subCategories.length,
											categoryDetail: data.data
										};
										return value;
									});
								});
					});
		},

		getCategoryProduct: function (cat_id) {

			gulServiceCall.getUrls()
					.then(function (response) {
						var url = response.data.categoryUrl + '/' + cat_id + '/products';
						return apiFactory.getApiData(url)
								.then(function (response1) {
									var categoryIDs = [];
									categoryProDetail = [];
									var data = response1.data.products;
									var dataLength = data.length;
									for (var i = 0; i < dataLength; i++) {
										var shopName = '';
										if (angular.isObject(data[i].shop)) {
											shopName = data[i].shop.name;
											var value = {
												"id": data[i].shop.id,
												"name": data[i].shop.name
											};
											categoryIDs.push(value);
										} else {
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
									return isImage(mFixPath + 'category/banner_' + cat_id + '.jpg' + mToken, $q).then(function (result) {

										value = {
											banner: result,
											urls: response.data,
											fixPath: response.data.fixImagePath,
											token: response.data.token,
											categoryProDetail: categoryProDetail,
											categoryIDs: categoryIDs
										};
										return value;

									});


								});


					});


		},

		/**
		 * Adding user New Shipping Address
		 * @param customerUrl
		 * @param shippingData
		 */
		addNewShipping: function (customerUrl, shippingData) {
			apiFactory.postApiAuthData(customerUrl, shippingData)
					.then(function (data) {
						return sdo.getShippingList().then(function (data) {

							return data;
						});
					});
		}

	}
	return sdo;

}]);

app.factory('gulServiceCall', ['$http', '$q', '$timeout', '$cookies', 'Base64', '$window', function ($http, $q, $timeout, $cookies, Base64, $window) {
	var sdo = {

		getUrls: function () {
			return $http.get('gulgs.properties')
					.then(function (one) {
						// console.log("ONE", one);
						return one;
					});
		},


		updateShippingAddress: function () {

			sdo.getUrls().then(function (data) {
				var base64 = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
				var loginAuth = base64;
				var config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Basic ' + loginAuth
					}
				}
				return $http.put(
						data.data.shippingUrl + '/' + updateDetail.shippingDetail.id, updateShippingAddress, config
				).then(function (data) {
					return $http.get(
							data.data.loginUrl, config
					).then(function (data, status) {
						return data.data.customerShipping;
					});
				});
			});

		},

		signIn: function (loginEmail, loginPass) {
			var base64 = Base64.encode(loginEmail + ':' + loginPass);

			var loginAuth = base64;
			var config = {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Basic ' + loginAuth

				}
			}

			return sdo.getUrls().then(function (data) {
				return $http.get(
						data.data.loginUrl, config
				).then(function (data) {
					console.log(data);
					if ($cookies.get("username") != loginEmail) {
						var value = {
							"username": data.data.username,
							"password": loginPass,
							"id": data.data.id,
							"shopId": JSON.stringify(data.data.shop)
						};
						$cookies.put("username", JSON.stringify(value));
						$cookies.put("userId", data.data.id);
						console.log("VALUE: ", value);
						return 0;
					} else {
						return 1;
					}

				});
			});

		},

		updateIsActive: function (shippingId1, isActive1, shippingId2, isActive2, customerUrl) {
			var data1 = {
				"isActive": isActive1
			};
			console.log("Data1: ", data1);
			var data2 = {
				"isActive": isActive2
			};
			console.log("Data2: ", JSON.parse($cookies.get("username")));

			var mId = JSON.parse($cookies.get("username")).id;
			var base64 = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
			var loginAuth = base64;

			var promise1 = $http({
				method: 'PUT',
				url: customerUrl + '/' + mId + '/customershipping/' + shippingId1,
				data: data1,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Basic ' + loginAuth
				},
				cache: 'false'
			});
			var promise2 = $http({
				method: 'PUT',
				url: customerUrl + '/' + mId + '/customershipping/' + shippingId2,
				data: data2,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Basic ' + loginAuth
				},
				cache: 'false'
			});

			return $q.all([promise1, promise2]).then(function (data) {
				return 1;
			}, function onError(response) {
				return 0;
				console.log("onError", response);

			});
		},

		updateCustomer: function () {

		}
	}

	return sdo;
}]);