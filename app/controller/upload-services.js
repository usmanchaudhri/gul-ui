/**
 * Created by Khan on 5/12/2016.
 */
app.factory('gulApis', ['$http', '$q', '$timeout', '$cookies', 'Base64', function ($http, $q, $timeout, $cookies, Base64) {

    var sd = {


        /**
         List of Urls
         **/

         getUrls:  function () {
            return $http.get('gulgs.properties')
                .then(function (one) {
                    console.log("ONE", one);
                    return one;
                });
        },

        getCategoryData: function (categoryUrl) {
            return $http.get(categoryUrl)
                .then(function (response1) {
                    var categoryList = [];
                    var categoryDetail = response1.data;
                    for (var i = 0; i < response1.data.length; i++) {
                        if (response1.data[i].subCategories.length > 0) {
                            categoryList.push(response1.data[i]);
                        }
                    }
                    console.log("catergoryDetail: ", categoryDetail);
                    return {
                        "categoryList": categoryList,
                        "categoryDetail": categoryDetail
                    }
                });
        },

        uploadProduct: function (productUrl,proPayload) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
           return $http.post(
                productUrl, proPayload, config
            ).success(function (data, status) {
                return data;
            }).error(function (data, status) {
                console.log(data);
                console.log(status);
            });
        },

        uriToFile: function(uriArray,newProId ,count){
            var countIndex = 0;
            var resolution = '';
            if (count == 0) {
                resolution = '600x600';
            } else {
                resolution = '300x300';
            }
            count = 0;
            angular.forEach(uriArray, function (item) {
                count++;
                console.log("URI COUNT: ",uriArray.length);

                countIndex++;
                tempFiles = [];
                var flag = false;
                if (!flag) {
                    console.log(resolution);

                    var fileCheck = sd.dataURItoBlob(item);
                    var file1 = new File([fileCheck], resolution + '-' + count + '-img-' + newProId + '.jpg');
                    var value = {
                        // File Name
                        name: resolution + '-' + count + '-img-' + newProId + '.jpg',
                        //File Size
                        size: file1.size,
                        //File URL to view
                        url: URL.createObjectURL(file1),
                        // File Input Value
                        _file: file1
                    };
                    console.log("COUNT COUNT",count);
                    tempFiles.push(value);
                }
            });
            return tempFiles;
        },

        dataURItoBlob: function(dataURI){
            var binary = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: mimeString});
        },

        createShop: function(shopUrl,shopUpload){
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            $http.post(
                shopUrl, shopUpload, config
            ).then(function (data) {
                return data.id;
            });
        }

    };


    return sd;
}]);