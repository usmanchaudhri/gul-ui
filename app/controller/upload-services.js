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
        
        uploadProduct: function (proPayload,productUrl) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
           return $http.post(
                productUrl, proPayload, config
            ).success(function (data, status) {
                return data;

              //  $scope.uploadProduct();
            }).error(function (data, status) {
                console.log(data);
                console.log(status);
            });
        }
        
        

     };


    return sd;
}]);