app.directive('resImage', function($q) {
		'use strict'

		var URL = window.URL || window.webkitURL;

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
			var maxWidth = options.resizeMaxWidth || 250;
			var quality = options.resizeQuality || 0.2;
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
			return deferred.promise;
		};


		return {
			restrict: 'A',
			scope: {
				resImage: '=',
				resizeMaxHeight: '@?',
				resizeMaxWidth: '@?',
				resizeQuality: '@?',
				resizeType: '@?',
			},
			link: function postLink(scope, element, attrs, ctrl) {

				var doResizing = function(imageResult, callback) {
					/*console.log("DORESIZING");
					console.log(imageResult);*/
					createImage(imageResult.url, function(image) {
							/*console.log("createImage");
							console.log(image);*/
							var dataURL = resizeImage(image, scope);
							imageResult.resized = {
								dataURL: dataURL,
								type: dataURL.match(/:(.+\/.+);/)[1],
							};
							//console.log("dataURL");
							//console.log(dataURL);
							callback(imageResult);
						});
				};

				var applyScope = function(imageResult) {
					scope.$apply(function() {
						
						if(scope.resImage.length <5)
							scope.resImage.push(imageResult);
						    
							console.log(scope.resImage);/*
							console.log(scope.resImage.length);*/
						});
				};


				element.bind('change', function (evt) {
						//console.log("resImage: " + scope.resImage);
						//when multiple always return an array of images
						if(angular.isUndefined(scope.resImage) ){
							scope.resImage = [];
						}
						var files = evt.target.files;
						for(var i = 0; i < files.length; i++) {
							//create a result object for each file in files
							var imageResult = {
								file: files[i],
								url: URL.createObjectURL(files[i])
							};
console.log("imageResult Object");
console.log(imageResult);
							fileToDataURL(files[i]).then(function (dataURL) {
									imageResult.dataURL = dataURL;
									//console.log("dataURL");
                             
								});

							if(scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
								doResizing(imageResult, function(imageResult) {
										applyScope(imageResult);
									});
							}
							else { //no resizing
								//console.log("NO RESIZE");
								applyScope(imageResult);
							}
						}
					});
			}
		};
	});
