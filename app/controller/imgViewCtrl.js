app.controller('imgViewCtrl',['$scope', 'Lightbox','$rootScope' , function ($scope, Lightbox,$rootScope) {
		$scope.images = [];
		$scope.imageUrl = '';
		$scope.openLightboxModal = function (img,imgIndex) {
			$scope.images = [];
			angular.forEach($scope.allFiles, function(value, key){
			$scope.images.push(value);	
			});
			console.log("View LightBox: "+ $scope.images.length);
			Lightbox.openModal($scope.images, imgIndex,2);
			//console.log("CLose");
		};
		$scope.openLightboxCrop = function (img,indexN) {
			$scope.images = [];
			console.log("Index num: " + indexN);
			$scope.images.push(img);
			Lightbox.openModal($scope.images,0 ,1,indexN);
			$scope.indexNum = indexN;
		};
		
		$scope.openZoomModal = function (img,indexNo) {
			$scope.images = [];
   			console.log("Zoom Index num: " + indexNo);
			$scope.images.push(img);
			Lightbox.openModal($scope.images,0 ,3,indexNo);
			$scope.indexNum = indexNo;
  		};
  
		
		
		$scope.type='circle';
		$scope.imageDataURI='';
		$scope.resImageDataURI='';
		$scope.indexNum='';
		$scope.resImgFormat='image/png';
		$scope.resImgQuality=1;
		$scope.selMinSize=200;
		$scope.resImgSize=200;
		
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
		
				//console.log('Res image');
				//console.log($scope.resImageDataURI);
				
			});
		
		$scope.closeLight = function(){
			console.log("Checkingnn");
			var cropResult = {
			img: $scope.cropImage,
			imgIndex: Lightbox.imageIndex,
			imgName: Lightbox.imageName
		};
			$rootScope.$broadcast('cropImage', cropResult);
					Lightbox.modalInstance.close();
		};
	}]);