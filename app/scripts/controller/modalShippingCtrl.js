/**
 * Created by Khan on 7/25/2016.
 */

app.controller('modalShipCtrl', ['$scope', '$uibModalInstance', 'updateDetail', '$http', '$cookies', 'Base64', '$q', 'restServices','shippingServices', function ($scope, $uibModalInstance, updateDetail, $http, $cookies, Base64, $q, restServices,shippingServices) {

    restServices.getUrls()
        .then(function (response) {
            $scope.loginUrl = response.data.loginUrl;
            $scope.shippingUrl = response.data.shippingUrl;
            $scope.customerUrl = response.data.customerUrl;
        });


    $scope.firstName = updateDetail.shippingDetail.firstName;
    $scope.lastName = updateDetail.shippingDetail.lastName;
    $scope.streetAddress1 = updateDetail.shippingDetail.address;
    $scope.city = updateDetail.shippingDetail.city;
    $scope.state = updateDetail.shippingDetail.state;
    $scope.zip = updateDetail.shippingDetail.zipcode;
    $scope.country = updateDetail.shippingDetail.country;


    if (updateDetail.flag == 0) {
        $scope.updateMessage = "Add New Address"
        $scope.submitButtonText = "Create Shipping Address";
    }
    else {
        $scope.updateMessage = "Update Shipping Address";
        $scope.submitButtonText = "Update Shipping Address";
    }



    $scope.send = function () {
        if (updateDetail.flag == 0) {
            newShipping();
        } else {
            updateShippingInfo();
        }
    };

    /**
     * This method dismiss shipping Modal
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    /**
     * This method call when user update his already
     * exist shippind address
     */
    var updateShippingInfo = function () {
        shippingServices.updateShippingAddress($scope.shippingData()).then(function (data) {
            var getShippingDetails = data.data.customerShipping;
            $uibModalInstance.close(getShippingDetails);
        });
    };

    /**
     * This method call addNewShipping of shippingServices
     * to add shipping address.if user do not has any
     * shipping address its set his default shipping address
     */
    var newShipping = function () {
        var isActiveValue = "n";
        if (updateDetail.shippingListSize == 0) {
            isActiveValue = "y";
        }
        shippingServices.addNewShipping($scope.customerUrl, $scope.shippingData(isActiveValue)).then(function (data) {

            var getShippingDetails = data;
            $uibModalInstance.close(getShippingDetails);
        });
    }

    /**
     * This Method get all data from shipping form
     * and return it in json format
     * @param isActiveValue
     * @returns {{firstName: (*|string|string), lastName: (*|string|string|string), address: *, city: (*|boolean|string|exports.schema.properties.city|{type}|Document.city), state: *, isActive: string, zipcode: *, country: (*|boolean|Document.country), isActive: string}}
     */
    $scope.shippingData = function (isActiveValue) {
        return  {
            "firstName": $scope.firstName,
            "lastName": $scope.lastName,
            "address": $scope.streetAddress1,
            "city": $scope.city,
            "state": $scope.state,
            "zipcode": $scope.zip,
            "country": $scope.country,
            "isActive": isActiveValue
        }
    };

}]);