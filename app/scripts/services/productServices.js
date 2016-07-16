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
        sendMessage: function () {
            twilioServices.createChannel().then(function () {

            });
        }

    }
    return sdo;

}]);