app.controller('allShopCtrl', ['$scope', 'allShopsList', function ($scope, allShopsList) {

    /**
     * Getting Allshop information From allshoplist var which is sent from Services.
     */

    $scope.fixPath = allShopsList.fixPath;
    $scope.token = allShopsList.token;
    $scope.allShopDetail = allShopsList.allShopDetail;
}]);
        
