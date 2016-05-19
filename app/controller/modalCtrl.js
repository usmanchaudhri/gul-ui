app.controller('modalCtrl', ['$scope', '$uibModalInstance', 'name', function ($scope, $uibModalInstance, name) {
    $scope.send = function (msg) {
        $uibModalInstance.close(msg);
    };

    $scope.productDetailName = name;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

app.controller('modalShipCtrl', ['$scope', '$uibModalInstance', 'updateDetail', '$http', '$cookies', 'Base64', '$q', 'gulServiceCall', function ($scope, $uibModalInstance, updateDetail, $http, $cookies, Base64, $q, gulServiceCall) {

    gulServiceCall.getUrls()
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
    } else {
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

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    var updateShippingInfo = function () {
        var updateShippingAddress = {
            "firstName": $scope.firstName,
            "lastName": $scope.lastName,
            "address": $scope.streetAddress1,
            "city": $scope.city,
            "state": $scope.state,
            "zipcode": $scope.zip,
            "country": $scope.country
        };
        gulServiceCall.updateShippingAddress().then(function (data) {
            var getShippingDetails = data.data.customerShipping;
            $uibModalInstance.close(getShippingDetails);
        });
    };

    var newShipping = function () {
        var isActiveValue = "n";
        console.log("ShippingListSize", updateDetail.shippingListSize);
        if (updateDetail.shippingListSize == 0) {
            isActiveValue = "y";
        }
        var base64 = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
        console.log("username" + JSON.parse($cookies.get("username")).username + 'Password' + JSON.parse($cookies.get("username")).password);
        var loginAuth = base64;
        var config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + loginAuth
            }
        }
        console.log("Config" + loginAuth);
        $http.post(
            $scope.shippingUrl, $scope.shippingData(isActiveValue), config
        ).success(function (data, status) {
            console.log("Succesfully Added" + data);
            $http.get(
                $scope.loginUrl, config
            ).then(function (data, status) {
                console.log("Shipping Detail", data.data);
                var getShippingDetails = data.data.customerShipping;
                $uibModalInstance.close(getShippingDetails);
            });
        }).error(function (data, status) {
            console.log(data);
            console.log(status);
        });
    }

    $scope.shippingData = function (isActiveValue) {
        return allShippingData = {
            "firstName": $scope.firstName,
            "lastName": $scope.lastName,
            "address": $scope.streetAddress1,
            "city": $scope.city,
            "state": $scope.state,
            "isActive": "n",
            "zipcode": $scope.zip,
            "country": $scope.country,
            "isActive": isActiveValue
        }
    };
}]);
 
 
 