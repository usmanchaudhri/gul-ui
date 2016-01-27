element.bind('change', function (evt) {
					
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