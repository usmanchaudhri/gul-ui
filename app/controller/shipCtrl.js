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

/*
    $scope.confirm = function (position) {

        if ($cookies.get("username") != null) {
            $scope.animationsEnabled = true;
            $uibModal.open({
                    templateUrl: 'confirm.html',
                    controller: 'modalDefaultShipCtrl',
                    resolve: {
                        data: function () {
                            var data = {
                                "shippingDetail": shippingList,
                                "position": position
                            }
                            console.log("Returning Data to Other Ctrl", data)
                            return data;
                        }
                    }

                })
                .result.then(
                function (flag) {
                    if (flag == "1") {
                        console.log("Default Shipping Address Sucessfully Updated.");
                    } else if (flag == "0") {
                        console.log("Default Shipping Address failed to Update.");
                    }
                }
            );
        } else {
            $rootScope.$emit("signin", {});
        }
    };
*/

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


/*app.controller('modalDefaultShipCtrl', ['$scope', '$uibModalInstance', 'data', '$http', '$q', '$cookies', 'Base64', 'gulServiceCall', function ($scope, $uibModalInstance, data, $http, $q, $cookies, Base64, gulServiceCall) {

 $scope.getShippingDetails = data.shippingDetail;
 console.log("In modalDefualtShip Ctrl", data);


 $http.get("gulgs.properties")
 .then(function (response) {
 $scope.customerUrl = response.data.customerUrl;
 });

 $scope.cancel = function () {
 console.log("In Cancel Function");
 $uibModalInstance.dismiss('cancel');
 };

 $scope.updateDefaultShippingAddress = function () {
 isActiveChange(data.position);

 };

 var isActiveChange = function (position) {

 console.log("Object", position);
 // Removing Previous Default Shipping Address
 for (var i = 0; i < $scope.getShippingDetails.length; i++) {
 if ($scope.getShippingDetails[i].isActive == "y") {
 console.log("ISACTIVE CHANGE: " + $scope.getShippingDetails[i].id + " n " + $scope.getShippingDetails[position].id + " y ");
 $scope.updateIsActive($scope.getShippingDetails[i].id, "n", $scope.getShippingDetails[position].id, "y");

 }
 }

 console.log("Exiting isActiveChangeFunction");
 };
 $scope.updateIsActive = function (shippingId1, isActive1, shippingId2, isActive2) {

 gulServiceCall.updateIsActive(shippingId1, isActive1, shippingId2, isActive2,$scope.customerUrl).then(function (data) {

 if (data == '1') {
 $uibModalInstance.dismiss("1");
 } else {

 $uibModalInstance.dismiss("0");
 }
 });

 };


 }]);
 */