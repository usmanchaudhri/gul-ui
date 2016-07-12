/**
 * Created by Khan on 7/13/2016.
 */
app.factory('shopServices', [ 'restServices', function ( restServices) {

    var sdo = {

        /**
         * Get All shop exist
         * @returns {*}
         */
        getallShops: function () {

            return restServices.getUrls()
                .then(function (response) {
                    var url = response.data.shopUrl;
                    return restServices.getApiData(url)
                        .then(function (response1) {
                            var value = {
                                allShopDetail: response1.data,
                                fixPath: response.data.fixImagePathShop,
                                token: response.data.token
                            };
                            return value;
                        });
                });
        },

        /**
         GET SPECIFIC SHOP on which user click
         **/

        getShop: function (shop_id) {
            return restServices.getUrls()
                .then(function (response) {
                    return restServices.getShop(shop_id).then(function (data) {
                        var value =
                        {
                            fixPath: response.data.fixImagePath,
                            fixPathShop: response.data.fixImagePathShop,
                            token: response.data.token,
                            shop: data[0].data,
                            designer: data[1].data
                        };
                        return value;
                    });
                });
        },

    }
    return sdo;

}]);