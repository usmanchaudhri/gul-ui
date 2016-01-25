app.controller('uploadCtrl',['$scope', 'Upload', '$timeout','$http', function($scope, Upload, $timeout,$http) {
			$scope.name = 'World';
			$scope.allFiles = [];
			$scope.progressArr = []; 
			$scope.showProgress = false;
			$http.get("url.properties")
			.then(function(response) {
			
					$scope.productUrl = response.data.productUrl;
					$scope.categoryUrl = response.data.categoryUrl;
					$http.get(response.data.categoryUrl)
					.then(function(response1){
							$scope.categoryDetail = response1.data;
    	
						});
				});
			
			
			/*
			*
			Add images into Array
			*
			*/
			
			
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
			
			/*
			*
			Total Images Number
			*
			*/
			
			
			$scope.getNumber = function(num) {
				num = num-$scope.allFiles.length;
				return new Array(num);   
			}
			
			/*
			*
			product Info Upload
			*
			*/
			
			
			$scope.upload=function(){
				$scope.showProgress = true;
				var count = -1;
				var config = {
					headers : {
						'Content-Type': 'application/json'
					}
				}
				$http.post(
					$scope.productUrl,  $scope.proUpload(),config
				).success(function(data, status) {
						console.log(data);
						$scope.newProId = data.id;
					}).error(function (data, status) {
						console.log(data);
					});
			};
			
			/*
			*
			Upload Images to Dropbox
			*
			*/
			
			$scope.uploadImages = function(){
			var count = -1;
				angular.forEach($scope.allFiles, function(value, key){
						count ++;
						var imgFile = value._file;
						var value = {
							// File Name 
							name: 'img-'+$scope.newProId+'-'+count,
							//File Size 
							size: value.size,
							//File URL to view 
							url: URL.createObjectURL(value._file),
							// File Input Value 
							_file: value
						};
						$scope.one = value;
						console.log($scope.one);
						var value1 = {
							imgName: $scope.one.name,
							imgIndex: count	,
							imgProgress: 0
						};
						console.log(value1);
						$scope.progressArr.push(value1);
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
			
			}
			
			/*
			*
			product Upload Payload
			*
			*/
			
			$scope.proUpload = function(){
				
				var proPayload = {
					"sku": $scope.proSku,
					"name": $scope.proName,
					"shortDesc":  $scope.proShortDesc,
					"longDesc": $scope.proLongDesc,
					"imageInfo": {
						"imagePath": "/listing/"
					},
					"quantity": $scope.proQty,
					"category": {
						"id": $scope.cat.id
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
			
			/*
			*
			Remove Image 
			*
			*/
			
			$scope.removeImage = function(index){
				console.log("REMOVE:" + index);
				$scope.allFiles.splice(index, 1);
			}
			
			/*
			*
			URI To Blob Conversion
			*
			*/
			$scope.dataURItoBlob = function(dataURI) {
				var binary = atob(dataURI.split(',')[1]);
				var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
				var array = [];
				for(var i = 0; i < binary.length; i++) {
					array.push(binary.charCodeAt(i));
				}
				return new Blob([new Uint8Array(array)], {type: mimeString});
			};



			/*
			*
			Crop Image Result
			*
			*/
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
						$scope.allFiles.splice(arg.imgIndex, 1);
						$scope.allFiles.splice(arg.imgIndex, 0,value );
						//	$scope.allFiles.push(value);
					}
				});
		}]);
		






