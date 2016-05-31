app.controller('shipCtrl', ['$scope', '$cookies', '$location', '$http', 'Base64', 'shippingList', '$uibModal', '$q', 'gulServiceCall', function ($scope, $cookies, $location, $http, Base64, shippingList, $uibModal, $q, gulServiceCall) {

    if ($cookies.get("username") != null) {
        $scope.getShippingDetails = shippingList;
    } else {
        $location.path("#/");
    }
    gulServiceCall.getUrls()
        .then(function (response) {
            $scope.shippingUrl = response.data.shippingUrl;
            $scope.customerUrl = response.data.customerUrl;
            $scope.loginUrl = response.data.loginUrl;

        });

    $scope.isActive = "y";
    $scope.open = function (shippingDetail, position, flag) {

        var message = "";
        if ($cookies.get("username") != null) {
            $scope.animationsEnabled = true;
            $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'modalShipCtrl',
                    resolve: {
                        updateDetail: function () {
                            var value = {
                                "position": position,
                                "shippingDetail": shippingDetail,
                                "flag": flag,
                                "shippingListSize": $scope.getShippingDetails.length
                            };
                            return value;
                        }
                    }

                })
                .result.then(
                function (shippingDetail) {
                    $scope.getShippingDetails = shippingDetail;
                }
            );
        } else {
            $rootScope.$emit("signin", {});
        }
    };


    $scope.isActiveChange = function (position) {
        if ($cookies.get("username") != null) {
            console.log("Object", position);
            for (var i = 0; i < $scope.getShippingDetails.length; i++) {
                if ($scope.getShippingDetails[i].isActive == "y") {
                    $scope.updateIsActive($scope.getShippingDetails[i].id, "n", $scope.getShippingDetails[position].id, "y");

                }
            }
        } else {
            $rootScope.$emit("signin", {});
        }
    };

    $scope.updateIsActive = function (shippingId1, isActive1, shippingId2, isActive2) {
        gulServiceCall.updateIsActive(shippingId1, isActive1, shippingId2, isActive2, $scope.customerUrl).then(function (data) {
            console.log("DATA DATA: ", data);
        });

    };


}]);

