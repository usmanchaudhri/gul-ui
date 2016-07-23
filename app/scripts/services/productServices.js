/**
 * Created by Khan on 7/13/2016.
 */
app.factory('productServices', ['restServices', 'twilioServices', function (restServices, twilioServices) {

    var sdo = {


        /**
         GET PRODUCT DETAIL
         **/
        getProductDetail: function (pro_id) {

            return restServices.getUrls()
                .then(function (response) {
                    var url = response.data.productUrl + '/' + pro_id;
                    return restServices.getApiData(url)
                        .then(function (data) {
                            var value = {
                                urls: response.data,
                                fixPath: response.data.fixImagePath,
                                fixPathShop: response.data.fixImagePathShop,
                                token: response.data.token,
                                productDetail: data.data,
                                selectedItem: data.data.productVariation[0].size
                            };
                            console.log("PRoduct Detail: ", value);
                            return value;
                        });
                });
        },
        setReadMore : function () {
        if($scope.readMore == 180){
            $scope.readMore = 1500;
            $scope.readBtn = "READ LESS";
        }else{
            $scope.readMore = 180;
            $scope.readBtn = "READ MORE";
        }

    },
        getProductShopDetail : function(){

            var config = {
                headers : {
                    'Content-Type': 'application/json'
                }
            }
            console.log(productDetail.urls.shopUrl+"/"+$scope.productDetail.shop.id+"/shopOwner");
            $http.get(
                productDetail.urls.shopUrl+"/"+$scope.productDetail.shop.id+"/shopOwner",config
            ).success(function(data, status) {
                console.log(data);
                $scope.shopCustomer = data;
            }).error(function (data, status) {
                console.log(data);
                console.log(status);
            });


        },

        addToCart : function (prod, size, qty) {
        //call here add product to cookies
        //storeProductsInCookie(productDetail,selectedItem,productQty)
        //$rootScope.$on.storeProductsInCookie(prod,price,qty);
        var data = {
            "prod": prod,
            "size": size,
            "qty": qty
        };
        $rootScope.$emit("addToBag", { "data": data });
    }
}
    return sdo;

}]);