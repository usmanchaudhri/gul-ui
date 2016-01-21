/*
app.config(function (LightboxProvider) {
		// set a custom template
		LightboxProvider.templateUrl = 'view/upload/cropImage.html';
	});
*/
app.controller('imgViewCtrl', function ($scope, Lightbox,$rootScope) {
		$scope.images = [];
		$scope.imageUrl = '';
		$scope.openLightboxModal = function (img) {
			$scope.images.push(img);
			Lightbox.openModal($scope.images, 0,2);
			//console.log("CLose");
		};
		$scope.openLightboxCrop = function (img,indexN) {
			console.log("Index num: " + indexN);
			$scope.images.push(img);
			Lightbox.openModal($scope.images,0 ,1,indexN);
			$scope.indexNum = indexN;
		};
		
		$scope.size='small';
		$scope.type='circle';
		$scope.imageDataURI='';
		$scope.resImageDataURI='';
		$scope.indexNum='';
		$scope.resImgFormat='image/png';
		$scope.resImgQuality=1;
		$scope.selMinSize=100;
		$scope.resImgSize=200;
		//$scope.aspectRatio=1.2;
		$scope.onChange=function($dataURI) {
			console.log('onChange fired');
			console.log('Res CHANGE', $dataURI);
		};
		$scope.onLoadBegin=function() {
			console.log('onLoadBegin fired');
		};
		$scope.onLoadDone=function() {
			console.log('onLoadDone fired');
		};
		$scope.onLoadError=function() {
			console.log('onLoadError fired');
		};
		$scope.$watch('resImageDataURI',function(){
		
				console.log('Res image');
				console.log($scope.resImageDataURI);
				
			});
		
		$scope.closeLight = function(result){
			var cropResult = {
			img: $scope.resImageDataURI,
			imgIndex: Lightbox.imageIndex,
			imgName: Lightbox.imageName
		};
			$rootScope.$broadcast('cropImage', cropResult);
					Lightbox.modalInstance.close();
		};
	});