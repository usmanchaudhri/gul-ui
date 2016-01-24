app.controller('uploadCtrl',['$scope', 'Upload', '$timeout','$http', function($scope, Upload, $timeout,$http) {
			$scope.name = 'World';
			$scope.allFiles = [];
			$scope.progressArr = []; 
			$scope.showProgress = false;
			$http.get("url.properties")
			.then(function(response) {
			
					$scope.productUrl = response.data.productUrl;
				});
			$scope.$on('cropImage', function (event, arg) { 
					$scope.imageUrl =  arg.img;
					
					if($scope.imageUrl != ''){
						var fileCheck = $scope.dataURItoBlob($scope.imageUrl);
						var file1 = new File([fileCheck], arg.imgName);
						var value = {
							// File Name 
							name: file1.name,
							//File Size 
							size: file1.size,
							//File URL to view 
							url: URL.createObjectURL(file1),
							// File Input Value 
							_file: file1
						};
						console.log(value);
						$scope.allFiles.splice(arg.imgIndex, 1);
						$scope.allFiles.splice(arg.imgIndex, 0,value );
						//	$scope.allFiles.push(value);
					}
				});
			$scope.addImages=function(files){
				
				$scope.totImages = files.length+$scope.allFiles.length;
				if($scope.totImages <= 5){
				
			
					console.log("All Length: "+$scope.allFiles.length);
					angular.forEach(files, function (item) {
							var value = {
								// File Name 
								name: item.name,
								//File Size 
								size: item.size,
								//File URL to view 
								url: URL.createObjectURL(item),
								// File Input Value 
								_file: item
							};
							console.log("Value"+value);
							$scope.allFiles.push(value);
						});
				}else{
					alert("MAx 5 images");
				}
				console.log($scope.allFiles);
				
			};
			$scope.getNumber = function(num) {
				num = num-$scope.allFiles.length;
				return new Array(num);   
			}
			$scope.upload=function(){
				$scope.showProgress = true;
				var count = -1;
				//************** Product Info Upload  ****************\\\
			
				var config = {
					headers : {
						'Content-Type': 'application/json'
					}
				}
				var proPayload = {
					"sku": 'sku1556',//$scope.proSku,
					"name": 'Jeans pent Orange',//$scope.proName,
					"shortDesc":  'Orange Color Jeans PEnt',//$scope.proShortDesc,
					"longDesc": 'A attractive Orange Color jeans Pent or good Quality',//$scope.proLongDesc,
					"imageInfo": {
						"imagePath": "/listing/img-201.jpg"
					},
					"quantity": '20',//$scope.proQty,
					"category": {
						"id": 2
					},
					"pricingProduct": {
						"storedValue": '50',//$scope.proPrice
					},
					"shop": {
						"id": 2
					},
					"productVariation": [{}]
				}
			
				$http.post(
					$scope.productUrl,  proPayload,config
				).success(function(data, status) {
						console.log(data);
				
					}).error(function (data, status) {
						console.log(data);
					});
			
				//************** Product Info Upload  ****************\\\
				
				
				
				
				
				
				
				
				angular.forEach($scope.allFiles, function(value, key){
						count ++;
						console.log(value._file);
         
						$scope.one = value;
						console.log($scope.one);
						var value = {
							imgName: $scope.one.name,
							imgIndex: count	,
							imgProgress: 0
						};
						console.log(value);
						$scope.progressArr.push(value);
						// alert($scope.files[0]+" files selected ... Write your Upload Code"); 
						$scope.upload = Upload.upload({
								url: 'https://content.dropboxapi.com/1/files/auto/gul/product/images?access_token=UQkhjQYKpOEAAAAAAAAAsEi5Y5enzU4nIHL9SvyRU0oiIo5dUXAoolRn-Py3e0Ne',
								data: {file: $scope.one._file}
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
								
								//		$scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
								angular.forEach($scope.progressArr, function(value, key){
										console.log(evt.config);
										if(evt.config._file.name == value.imgName){
											$scope.progressArr[value.imgIndex].imgProgress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
											console.log("PRogress: " + $scope.progressArr[value.imgIndex].imgProgress);	
										}
									});
								
							});
					});
			};
			
			
			$scope.proUpload = function(){
				
				var proPayload = {
					"sku": $scope.proSku,
					"name": $scope.proName,
					"shortDesc":  $scope.proShortDesc,
					"longDesc": $scope.proLongDesc,
					"imageInfo": {
						"imagePath": "/listing/img-201.jpg"
					},
					"quantity": $scope.proQty,
					"category": {
						"id": 2
					},
					"pricingProduct": {
						"storedValue": $scope.proPrice
					},
					"shop": {
						"id": 2
					},
					"productVariation": [{}]
				}
			}
			
			
			$scope.removeImage = function(index){
				console.log("REMOVE:" + index);
				$scope.allFiles.splice(index, 1);
			}
			
			$scope.dataURItoBlob = function(dataURI) {
				var binary = atob(dataURI.split(',')[1]);
				var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
				var array = [];
				for(var i = 0; i < binary.length; i++) {
					array.push(binary.charCodeAt(i));
				}
				return new Blob([new Uint8Array(array)], {type: mimeString});
			};

		}]);






