app.controller('uploadCtrl',['$scope', 'Upload', '$timeout', function($scope, Upload, $timeout) {
			$scope.name = 'World';
			$scope.allFiles = [];
			//$scope.files = []; 
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
				
				angular.forEach($scope.allFiles, function(value, key){
        
						console.log(value._file);
         
						$scope.one = value;
						console.log($scope.one);
						// alert($scope.files[0]+" files selected ... Write your Upload Code"); 
						$scope.upload = Upload.upload({
								url: 'https://content.dropboxapi.com/1/files/auto/gul/product/images?access_token=UQkhjQYKpOEAAAAAAAAAsEi5Y5enzU4nIHL9SvyRU0oiIo5dUXAoolRn-Py3e0Ne',
								data: {file: $scope.one._file}
							});

						$scope.upload.then(function (response) {
						$timeout(function () {
						$scope.result = response.data;
						});
						}, function (response) {
						if (response.status > 0)
						$scope.errorMsg = response.status + ': ' + response.data;
						}, function (evt) {
						// Math.min is to fix IE which reports 200% sometimes
						$scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
						});
					});
			};

		}]);
