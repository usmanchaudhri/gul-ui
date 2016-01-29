app.controller('uploadCtrl',['$scope', 'Upload', '$timeout','$q','$http', function($scope, Upload, $timeout,$q,$http) {
			$scope.name = 'World';
			$scope.allFiles = [];
			$scope.progressArr = []; 
			$scope.showProgress = false;
			$scope.resImage = [];
			var promises = [];
			$scope.tempFiles = [];
			$scope.resizeMaxHeight = 600;
			$scope.resizeMaxWidth = 600;
			var imgSize = 0;
			
			
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
				console.log($scope.proUpload());
				$http.post(
					$scope.productUrl, $scope.proUpload(),config
				).success(function(data, status) {
						console.log(data);
						$scope.newProId = data.id;
						$scope.uploadImages();
					}).error(function (data, status) {
						console.log(data);
						console.log(status);
					});
			};



			$scope.resizeUpload = function(){
				imgSize++;
				angular.forEach($scope.allFiles, function (myItem) {
						 var deferred = $q.defer();
						promises.push(deferred.promise);		
						resizeImg(myItem,deferred);
					});
				$q.all(promises).then(function () {
       		if(imgSize <2){
       			if(imgSize == 1){
					$scope.resizeMaxHeight = 300;
			$scope.resizeMaxWidth = 300;
			
				}
       			$scope.resizeUpload();
    		}else{
				$scope.uploadImages();
			}
    });
			}
			
			/*
			*
			Upload Images to Dropbox
			*
			*/
			
			$scope.uploadImages = function(){
				var count = -1;
				$scope.uriToFile();
				console.log("Image Upload: " + $scope.tempFiles);
				angular.forEach($scope.tempFiles, function(value, key){
						count++;
						$scope.one = value;
						var value1 = {
							imgName: $scope.one.name,
							imgIndex: count	,
							imgProgress: 0
						};
						$scope.progressArr.push(value1);
						// alert($scope.files[0]+" files selected ... Write your Upload Code"); 
						$scope.upload = Upload.upload({
								url: 'https://content.dropboxapi.com/1/files/auto/gul/product/images?access_token=UQkhjQYKpOEAAAAAAAAAsEi5Y5enzU4nIHL9SvyRU0oiIo5dUXAoolRn-Py3e0Ne',
								data: {file: $scope.one._file}
							});
						$scope.upload.then(function (response) {
								$timeout(function () {
										$scope.result = response.data;
										//	console.log($scope.result);
									});
							}, function (response) {
								if (response.status > 0)
								$scope.errorMsg = response.status + ': ' + response.data;
							}, function (evt) {
								// Math.min is to fix IE which reports 200% sometimes
								angular.forEach($scope.progressArr, function(value, key){
										if(evt.config._file.name == value.imgName){
											$scope.progressArr[value.imgIndex].imgProgress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
								console.log($scope.progressArr[value.imgIndex].imgProgress);
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
				
				return proPayload = {
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
						"id": $scope.cat.id
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
						console.log(value);
						$scope.allFiles.splice(arg.imgIndex, 1);
						$scope.allFiles.splice(arg.imgIndex, 0,value );
						//	$scope.allFiles.push(value);
					}
				});


			/*
			*
			Creating file from URI
			*
			*/
			
		$scope.uriToFile = function(){
				var count = 0;
				
				angular.forEach($scope.resImage, function (item) {
						count++;
						console.log(item);
							
						var fileCheck = $scope.dataURItoBlob(item.resized.dataURL);
						var file1 = new File([fileCheck],'img-'+$scope.newProId+'-'+count+'.jpg');
						var value = {
							// File Name 
							name: 'img-'+$scope.newProId+'-'+count+'.jpg',
							//File Size 
							size: file1.size,
							//File URL to view 
							url: URL.createObjectURL(file1),
							// File Input Value 
							_file: file1
						};
						/*	var value = {
						// File Name 
						name: item.name,
						//File Size 
						size: item.size,
						//File URL to view 
						url: URL.createObjectURL(item),
						// File Input Value 
						_file: item
						};*/
						//		console.log(value);
						$scope.tempFiles.push(value);
					});
				console.log("TEMP");
				console.log($scope.tempFiles);
									
			}

/********************** IMAGE UPLOAD RESIZE DEIRECTIVE **********************************/


			var getResizeArea = function () {
				var resizeAreaId = 'fileupload-resize-area';

				var resizeArea = document.getElementById(resizeAreaId);

				if (!resizeArea) {
					resizeArea = document.createElement('canvas');
					resizeArea.id = resizeAreaId;
					resizeArea.style.visibility = 'hidden';
					document.body.appendChild(resizeArea);
				}

				return resizeArea;
			}

			var resizeImage = function (origImage, options) {
				/*console.log("resizeImage");
				console.log(origImage);*/
				var maxHeight = options.resizeMaxHeight || 300;
				var maxWidth = options.resizeMaxWidth || 300;
				var quality = options.resizeQuality || 1;
				var type = options.resizeType || 'image/jpeg';

				var canvas = getResizeArea();

				var height = origImage.height;
				var width = origImage.width;

				// calculate the width and height, constraining the proportions
				if (width > height) {
					if (width > maxWidth) {
						height = Math.round(height *= maxWidth / width);
						width = maxWidth;
					}
				} else {
					if (height > maxHeight) {
						width = Math.round(width *= maxHeight / height);
						height = maxHeight;
					}
				}

				canvas.width = width;
				canvas.height = height;
console.log(width + "Height: " + height);
				//draw image on canvas
				var ctx = canvas.getContext("2d");
				ctx.drawImage(origImage, 0, 0, width, height);

				// get the data from canvas as 70% jpg (or specified type).
				return canvas.toDataURL(type, quality);
			};

			var createImage = function(url, callback) {
				var image = new Image();
				image.onload = function() {
					callback(image);
				};
				image.src = url;
			};

			var fileToDataURL = function (file) {
				/*console.log("FILE:");
				console.log(file);*/
				var deferred = $q.defer();
				var reader = new FileReader();
				reader.onload = function (e) {
					deferred.resolve(e.target.result);
				};
				reader.readAsDataURL(file);
				console.log("File to Data URL");
				return deferred.promise;
			};

			var doResizing = function(imageResult, callback) {
				/*console.log("DORESIZING");
				console.log(imageResult);*/
				createImage(imageResult.url, function(image) {
						/*console.log("createImage");
						console.log(image);*/
						var dataURL = resizeImage(image, $scope);
						imageResult.resized = {
							dataURL: dataURL,
							type: dataURL.match(/:(.+\/.+);/)[1],
						};
						//console.log("dataURL");
						//console.log(dataURL);
						callback(imageResult);
					});
			};

			var applyScope = function(imageResult,deferred) {
						
				if($scope.resImage.length <5)
				$scope.resImage.push(imageResult);
						   // if($scope.allFiles.length == $scope.resImage.length)
						    	deferred.resolve(true);
				console.log($scope.resImage);/*
				console.log(scope.resImage.length);*/
			};

			var resizeImg = function(files,deferred){						
				//create a result object for each file in files
				var imageResult = {
					file: files._file,
					url: URL.createObjectURL(files._file)
				};
				console.log("imageResult Object");
				console.log(imageResult);


				fileToDataURL(files._file).then(function (dataURL) {
						console.log("before");
						imageResult.dataURL = dataURL;
						console.log("dataURL");
                             
                             
						if($scope.resizeMaxHeight || $scope.resizeMaxWidth) { //resize image
							doResizing(imageResult, function(imageResult) {
									applyScope(imageResult,deferred);
								});
						}
						else { //no resizing
							//console.log("NO RESIZE");
							applyScope(imageResult,deferred);
						}
                             
					});

							
						
			};
		}]);






