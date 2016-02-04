app.controller('uploadCtrl',['$scope', 'Upload', '$timeout','$q','$http', function($scope, Upload, $timeout,$q,$http) {
			$scope.allFiles = [];
			$scope.progressArr = []; 
			$scope.showProgress = false;
			var resImage = [];
			var promises = [];
			var tempFiles = [];
			var cropImageArr = [];
			var resizeMaxHeight = 300;
			var resizeMaxWidth = 300;
			var imgSize = 0;
			
			
			$http.get("gulgs.properties")
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
				$scope.allFiles.push(value);

				
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


			$scope.uploadProduct = function(){
				$scope.uriToFile(cropImageArr);
				console.log(cropImageArr);
				$scope.resizeUpload(tempFiles);
			}

			$scope.resizeUpload = function(tmpFiles){
				console.log(tmpFiles);
				imgSize++;
				angular.forEach(tmpFiles, function (myItem) {
						var deferred = $q.defer();
						promises.push(deferred.promise);		
						resizeImg(myItem,deferred);
					});
				$q.all(promises).then(function () {
						/*if(imgSize <2){
						if(imgSize == 1){
						resizeMaxHeight = 300;
						resizeMaxWidth = 300;
			
						}
						$scope.resizeUpload(tmpFiles);
						}else{*/
						$scope.uploadImages();
						//}
					});
			}
			
			/*
			*
			Upload Images to Dropbox
			*
			*/
			
			$scope.uploadImages = function(){
				var count = -1;
				//console.log($scope.resImage);
				console.log("Image Upload: " + tempFiles);
				var uploadImgs = [];
				angular.forEach(resImage, function (myItem) {
						uploadImgs.push(myItem.resized.dataURL);
					});
				$scope.uriToFile(uploadImgs);
				console.log("Image Upload: " + tempFiles.length);
				angular.forEach(tempFiles, function(value, key){
						//		console.log("Imagasdfdsfas: ");
						console.log(value);
						count++;
						$scope.one = value;
						var value1 = {
							imgName: value.name,
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
							//	console.log(evt);
								angular.forEach($scope.progressArr, function(value, key){
										if(evt.config._file.name == value.imgName){
											$scope.progressArr[value.imgIndex].imgProgress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
											//console.log($scope.progressArr[value.imgIndex].imgProgress);
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
				cropImageArr.splice(index, 1);
				tempFiles.splice(index, 1);
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
							_file: file1,
							croped: true
						};
						console.log($scope.allFiles.length);
						//$scope.allFiles.splice(arg.imgIndex, );
						$scope.allFiles.splice(arg.imgIndex, 1,value );
						cropImageArr.splice(arg.imgIndex, 1,$scope.imageUrl );
						console.log("Custom: "+cropImageArr.length);
						console.log("After : "+$scope.allFiles.length);
						//	$scope.allFiles.push(value);
					}
				});


			/*
			*
			Creating file from URI
			*
			*/
			
			$scope.uriToFile = function(uriArray){
				var countIndex = 0;
				var count = tempFiles.length;
				console.log(count);
				var resolution = '';
				if(count == 0){
					resolution = '600x600';
				}else{
					resolution = '300x300';
				}
				angular.forEach(uriArray, function (item) {
						count++;
						countIndex++;
						//console.log(angular.isDefined($scope.allFiles[count-1].croped));
						var flag = false;
						/*if((uriArray.length + count) == $scope.allFiles.length){
						if(angular.isDefined($scope.allFiles[countIndex-1].croped)){
						flag = $scope.allFiles[countIndex-1].croped;
						}
						}*/
						if(!flag){
							var fileCheck = $scope.dataURItoBlob(item);
							var file1 = new File([fileCheck],resolution + '-img-'+$scope.newProId+'.png');
							var value = {
								// File Name 
								name: resolution + '-img-'+$scope.newProId+'.png',
								//File Size 
								size: file1.size,
								//File URL to view 
								url: URL.createObjectURL(file1),
								// File Input Value 
								_file: file1
							};
							tempFiles.push(value);
						}
					});
				//console.log("TEMP");
				console.log(tempFiles);
									
			}


			$scope.cropImageArray = function(crop,indexNum){
				console.log("DEFined: "+ angular.isDefined(crop) + "INDEX: " + indexNum);
				if(angular.isDefined(crop)){
				 		
					if(cropImageArr.length > indexNum){
						//		console.log("Crop IMAGE Replace: " + indexNum);
						//	console.log(crop);
						if(angular.isUndefined($scope.allFiles[indexNum].croped))
						cropImageArr.splice(indexNum, 1,crop);
					}else{
						//		console.log("Crop IMAGE push: " + indexNum);
						cropImageArr.push(crop);	
					}
			
					//	console.log("Crop IMAGE: " + cropImageArr.length);
					//	console.log(cropImageArr);
				}
				
				//alert(indexNum);
			};
			/********************** IMAGE UPLOAD RESIZE DEIRECTIVE **********************************/


			var getResizeArea = function () {
				var resizeAreaId = 'fileupload-resize-area';

				var resizeArea = document.getElementById(resizeAreaId);
console.log("ResizeArea Before");
					
				if (!resizeArea) {
					console.log("ResizeArea If Called");
					resizeArea = document.createElement('canvas');
					resizeArea.id = resizeAreaId;
					resizeArea.style.visibility = 'hidden';
					document.body.appendChild(resizeArea);
				}

				return resizeArea;
			}

			var resizeImage = function (origImage, options) {
				//var canvas = createHiDPICanvas(500, 600, 4);
            
                var canvas=document.getElementById("canvas");
        var ctx=canvas.getContext("2d");
            /// step 1
            var oc = document.createElement('canvas'),
                octx = oc.getContext('2d');
            oc.width = origImage.width ;
            oc.height = origImage.height; 
            octx.drawImage(origImage, 0,0, oc.width,oc.height);

            /// step 2
            octx.drawImage(oc,0,0,oc.width,oc.height);
            
            canvas.width=300;
            canvas.height=300;
            ctx.drawImage(oc,0,0,oc.width, oc.height,
                             0,0,canvas.width,canvas.height);
				
				return canvas.toDataURL('image/png',1);
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
				//console.log("File to Data URL");
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
						
				if(resImage.length <5)
				resImage.push(imageResult);
				// if($scope.allFiles.length == $scope.resImage.length)
				deferred.resolve(true);
				//	console.log("resolutions: "+ resImage.length);/*
				//	console.log(scope.resImage.length);*/
			};

			var resizeImg = function(files,deferred){						
				//create a result object for each file in files
				var imageResult = {
					file: files._file,
					url: URL.createObjectURL(files._file)
				};
				//console.log("imageResult Object");
				//console.log(imageResult);


				fileToDataURL(files._file).then(function (dataURL) {
						//console.log("before");
						imageResult.dataURL = dataURL;
						//console.log("dataURL");
                             
                             
						if(resizeMaxHeight || resizeMaxWidth) { //resize image
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
		
			var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

			createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

		}]);






