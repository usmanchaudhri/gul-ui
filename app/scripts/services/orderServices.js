/**
 * Created by Khan on 7/13/2016.
 */
app.factory('orderServices', [ 'restServices','$cookies', function ( restServices,$cookies) {

    var sdo = {


        /**
         * Get list of all orders placed by user
         * @returns {*}
         */
        getOrder: function () {
            return restServices.getUrls()
                .then(function (response) {
                    var url = response.data.customerUrl + '/' + $cookies.get("userId") + "/orders";
                    return restServices.getApiAuthData(url)
                        .then(function (response1) {
                            var value = {
                                orderDetail: response1.data,
                            };
                            return value;
                        });
                });
        },

        /**
         * This method Submit all cart items to server
         * as a Order 
         * @param orderPayload
         * @returns {*|{get}}
         */
        submitOrder: function (orderPayload) {
            return restServices.getUrls().then(function (response) {
                return restServices.postApiAuthData(
                    response.data.orderUrl, orderPayload
                ).then(function (data) {
                    return "success";
                });
            });
        }

    }
    return sdo;

}]);