app.controller('uploadCtrl',['$scope', 'Upload', '$timeout','$q','$http','$cookies','$location','$rootScope','gulApis', function($scope, Upload, $timeout,$q,$http,$cookies,$location,$rootScope,gulApis) {
    $scope.allFiles = [];
    $scope.progressArr = [];

    $scope.showProgress = false;
    $scope.subCategory = false;
    $scope.categoryList = [];

    var resImage = [];
    var resImageUri= [];
    var promises = [];
    var tempFiles = [];
    var cropImageArr = [];
    var resizeMaxHeight = 300;
    var resizeMaxWidth = 300;
    var imgSize = 0;
    //var imageResizeFlag = true;
    $scope.shopImage = [];
    console.log("upload page shop id",$cookies.get("username"));
    if(angular.isDefined($cookies.get("username"))){
        if(angular.isDefined(JSON.parse($cookies.get("username")).shopId)){
            //if(JSON.parse($cookies.get("username")).shopId != 0){
            console.log("upload page shop id",JSON.parse($cookies.get("username")).shopId);
            shopId = JSON.parse($cookies.get("username")).shopId;
        }else{
            $location.path("/newShop");
        }
    }else{
        $location.path("#a");
        $rootScope.$emit("signin", {});
    }
    /*	if($cookies.get("username") == null){

     $location.path("#/");
     }*/
    $http.get("gulgs.properties")
        .then(function(response) {
            $scope.productUrl = response.data.productUrl;
            $scope.categoryUrl = response.data.categoryUrl;
            $scope.shopUrl = response.data.shopUrl;
            $http.get(response.data.categoryUrl)
                .then(function(response1){
                    $scope.categoryDetail = response1.data;

                    for(var i = 0;i<response1.data.length;i++){
                        if(response1.data[i].subCategories.length>0){
                            $scope.categoryList.push(response1.data[i]);
                        }
                    }
                    console.log("catergoryDetail: ",$scope.categoryDetail);
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
        if($scope.allFiles.length > 0 ){
            $scope.showProgress = true;


            gulApis.uploadProduct($scope.productUrl = response.data.productUrl,$scope.proUpload()).then(function(data){
                console.log("UPLOAD DATA: ", data);
                $scope.newProId = data.id;
                $scope.uploadProduct();

            });

            }else{
            alert("Upload atleast one Image");
        }
    };


    /**
     *Get SubCategories
     **/

    $scope.getSubCat = function(){
        $scope.subCategoryDetail = [];
        for(var i=0;i < $scope.categoryDetail.length;i++){
            if($scope.categoryDetail[i].id == $scope.cat.id && $scope.categoryDetail[i].subCategories.length > 0){
                $scope.subCategoryDetail = $scope.categoryDetail[i].subCategories;
                $scope.subCategory = true;
            }
        }
        if($scope.subCategoryDetail.length == 0){
            $scope.subCategory = false;
        }

    }

    $scope.uploadProduct = function(){
        console.log("cropImageArr at Line 132:",cropImageArr);
        $scope.uriToFile(cropImageArr);
        console.log("Temp Files at Line 134:",tempFiles);
        $scope.resizeUpload(tempFiles);
    }
    $scope.uploadShop = function(){
        $scope.uriToFileShop(cropImageArr);
        $scope.resizeUploadShop(tempFiles);
    }

    $scope.resizeUpload = function(tmpFiles){
        console.log(tmpFiles);
        imgSize++;
        angular.forEach(tmpFiles, function (myItem) {
            var deferred = $q.defer();
            promises.push(deferred.promise);
            resizeImg(myItem,deferred);
            //console.log("in foreach loop at line 149");
        });
        $q.all(promises).then(function () {
            console.log("resImage at Line 151:",resImage);
            //if(imageResizeFlag==false){
            $scope.uploadImages();
            /*}else{

             angular.forEach(resImage, function (myItem) {
             resImageUri.push(myItem.resized.dataURL);
             });
             console.log("resImageUri at 162:",resImageUri);
             cropImageArr = resImageUri;
             console.log("cropImageArr at 164:",cropImageArr);
             $scope.uploadProduct();
             imageResizeFlag = false;
             } */

        });
    }

    $scope.resizeUploadShop = function(tmpFiles){
        imgSize++;
        angular.forEach(tmpFiles, function (myItem) {
            var deferred = $q.defer();
            promises.push(deferred.promise);
            resizeImg(myItem,deferred);
        });
        $q.all(promises).then(function () {
            uploadShopImg();
        });
    }

    /*
     *
     Upload Images to Dropbox
     *
     */

    $scope.uploadImages = function(){
        var count = -1;
        var uploadImgs = [];
        //	angular.forEach(resImage, function (myItem) {
        uploadImgs.push(resImage[0].resized.dataURL);
        //		});
        $scope.uriToFile(uploadImgs);
        angular.forEach(tempFiles, function(value, key){
            //		console.log("Imagasdfdsfas: ");
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
            "sku": $scope.proName,
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
                "id": "26"
            },
            "productVariation": [{
                "size": "L",
                "color": "Red"
            },{
                "size": "M",
                "color": "Red"
            },{
                "size": "S",
                "color": "Red"
            }]
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
     Create Shop
     *
     */

    var createShop = function(){
        shopPayload = {
            "name": $scope.proName,
            "designers":{
                "name":"HUMA MANZOOR"
            }
        }
    }
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
        count = 0;
        angular.forEach(uriArray, function (item) {
            count++;
            countIndex++;
            var flag = false;
            if(!flag){
                console.log(resolution);
                var fileCheck = $scope.dataURItoBlob(item);
                var file1 = new File([fileCheck],resolution + '-'+count+'-img-'+$scope.newProId+'.jpg');
                var value = {
                    // File Name
                    name: resolution + '-'+count+'-img-'+$scope.newProId+'.jpg',
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

    $scope.uriToFileShop = function(uriArray){
        var countIndex = 0;
        var count = tempFiles.length;
        count = 0;
        angular.forEach(uriArray, function (item) {
            count++;
            countIndex++;
            var flag = false;
            if(!flag){
                var fileCheck = $scope.dataURItoBlob(item);
                var file1 = new File([fileCheck],'shop-' + $scope.shopId+'.jpg');
                var value = {
                    // File Name
                    name: 'shop-'+$scope.shopId+'.jpg',
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

    }


    $scope.cropImageArray = function(crop,indexNum){
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

        var canvas=document.createElement("canvas");
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

        return canvas.toDataURL('image/jpeg',1);
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
        if (!ratio) { ratio = PIXEL_RATIO;}
        var can = document.createElement("canvas");
        can.width = w * ratio;
        can.height = h * ratio;
        can.style.width = w + "px";
        can.style.height = h + "px";
        can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
    }


    /*************************************/

    /*	$scope.addImage=function(files){
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
     };*/
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
            $http.post(
                $scope.shopUrl, $scope.shopUpload() ,config
            ).success(function(data, status) {
                $scope.shopId = data.id;
                $scope.uploadShop();
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
        //	$scope.uriToFile(uploadImgs);
        $scope.upload = Upload.upload({
            url: 'https://content.dropboxapi.com/1/files/auto/gul/product/shop?access_token=UQkhjQYKpOEAAAAAAAAAsEi5Y5enzU4nIHL9SvyRU0oiIo5dUXAoolRn-Py3e0Ne',
            data: {file: tempFiles[0]._file}
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
            $scope.progressShop = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if($scope.progressShop == 100){
                $location.path("/upload");
            }

        });
    };
}]);
