/**
 * Created by Khan on 7/13/2016.
 */
app.factory('shippingServices', [ 'restServices', function ( restServices) {

    var sdo = {


        /**
         * Get list of all shipping address of user
         * @returns {*}
         */
        getShippingList: function () {

            return restServices.getUrls()
                .then(function (response) {
                    var url = response.data.loginUrl;
                    return restServices.getApiAuthData(url)
                        .then(function (response1) {
                            return response1.data.customerShipping;
                        });
                });
        },



        /**
         * Adding user New Shipping Address
         * @param customerUrl
         * @param shippingData
         */
        addNewShipping: function (customerUrl, shippingData) {
            restServices.postApiAuthData(customerUrl, shippingData)
                .then(function (data) {
                    return sdo.getShippingList().then(function (data) {

                        return data;
                    });
                });
        },

        /**
         * This method update Shipping Address
         * of user
         */
        updateShippingAddress: function () {

            sdo.getUrls().then(function (data) {
                var base64 = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
                var loginAuth = base64;
                var config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + loginAuth
                    }
                }
                return $http.put(
                    data.data.shippingUrl + '/' + updateDetail.shippingDetail.id, updateShippingAddress, config
                ).then(function (data) {
                    return $http.get(
                        data.data.loginUrl, config
                    ).then(function (data, status) {
                        return data.data.customerShipping;
                    });
                });
            });

        },


        /**
         * This method change Default Shipping address
         * @param shippingId1
         * @param isActive1
         * @param shippingId2
         * @param isActive2
         * @param customerUrl
         * @returns {*}
         */
        updateDefaultShippingAddress: function (shippingId1, isActive1, shippingId2, isActive2, customerUrl) {
            var data1 = {
                "isActive": isActive1
            };
            console.log("Data1: ", data1);
            var data2 = {
                "isActive": isActive2
            };
            console.log("Data2: ", JSON.parse($cookies.get("username")));

            var mId = JSON.parse($cookies.get("username")).id;
            var base64 = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
            var loginAuth = base64;

            var promise1 = $http({
                method: 'PUT',
                url: customerUrl + '/' + mId + '/customershipping/' + shippingId1,
                data: data1,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + loginAuth
                },
                cache: 'false'
            });
            var promise2 = $http({
                method: 'PUT',
                url: customerUrl + '/' + mId + '/customershipping/' + shippingId2,
                data: data2,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + loginAuth
                },
                cache: 'false'
            });

            return $q.all([promise1, promise2]).then(function (data) {
                return 1;
            }, function onError(response) {
                return 0;
                console.log("onError", response);

            });
        },

    }
    return sdo;

}]);