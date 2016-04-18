app.controller('newShopCtrl',['$scope','$http','$q','$timeout','$location','$routeParams','$cookies','Upload', function($scope,$http,$q,$timeout,$location,$routeParams,$cookies,Upload) {
   
			$scope.shopImage = [];
			$http.get("gulgs.properties")
			.then(function(response) {
					$scope.fixPath = response.data.fixImagePath;
					$scope.token = response.data.token;
					$scope.shopUrl = response.data.shopUrl;
					
				});
				
			$scope.addImage=function(files){
				var value = {
					// File Name 
					name: files.name,
					//File Size 
					size: files.size,
					//File URL to view 
					url: URL.createObjectURL(files),
					// File Input Value 
					_file: files
				};
				//console.log("Value"+value);
				$scope.shopImage.push(value);
			};
			
			$scope.getShopDecision = function(){
				if($scope.shopImage.length > 0){
					return true;
				}
				return false;
			}
			
			$scope.createShop=function(){
				if($scope.getShopDecision){
					$scope.showProgress = true;
					var count = -1;
					var config = {
						headers : {
							'Content-Type': 'application/json'
						}
					}
					console.log("Shop Payload: ",$scope.shopUpload() );
					$http.post(
						$scope.shopUrl, $scope.shopUpload() ,config
					).success(function(data, status) {
						$scope,uploadShopImg();
						}).error(function (data, status) {
							console.log(data);
							console.log(status);
						});
				}else{
					alert("Upload atleast one Image");
				}
			};
			$scope.shopUpload = function(){
				
				return shopPayload = {
					"name": $scope.shopName, 
					"designers": [{"name":$scope.designerName, "imagePath": "/shop/"}],
					"shopOwner": {"id": JSON.parse($cookies.get("username")).id}
				}
			};
			var uploadShopImg = function(){
				$scope.uriToFile($scope.shopImage);
				$scope.upload = Upload.upload({
								url: 'https://content.dropboxapi.com/1/files/auto/gul/product/shop?access_token=UQkhjQYKpOEAAAAAAAAAsEi5Y5enzU4nIHL9SvyRU0oiIo5dUXAoolRn-Py3e0Ne',
								data: {file: $scope.value._file}
							});
						$scope.upload.then(function (response) {
								$timeout(function () {
										$scope.result = response.data;
											console.log($scope.result);
									});
							}, function (response) {
								if (response.status > 0)
								$scope.errorMsg = response.status + ': ' + response.data;
							}, function (evt) {
								// Math.min is to fix IE which reports 200% sometimes
									console.log(evt);
								angular.forEach($scope.progressArr, function(value, key){
										if(evt.config._file.name == value.imgName){
											$scope.progressArr[value.imgIndex].imgProgress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
											console.log($scope.progressArr[value.imgIndex].imgProgress);
										}
									});
							});
			};
				
			
																																							
		
		}]);
        
