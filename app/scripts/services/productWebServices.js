/**
 * Created by Khan on 7/25/2016.
 */
/**
 * Created by Khan on 7/13/2016.
 */
app.factory('productWebServices', ['$cookies','restServices', 'Base64','$http','$q', function ($cookies,restServices, Base64, $http , $q) {

    var sdo = {

        updateCustomerChannelName: function (mName,mDesigner,shopId,data1) {

            return restServices.getUrls().then(function(data){
                var loginAuth = Base64.encode(JSON.parse($cookies.get("username")).username + ':' + JSON.parse($cookies.get("username")).password);
                var promise1 = $http({
                    method: 'POST',
                    url: data.data.customerUrl + '/' + shopId + '/cchat',
                    data: data1,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    cache: 'false'
                });
                var promise2 = $http({
                    method: 'POST',
                    url: data.data.customerUrl + '/' + JSON.parse($cookies.get("username")).id + '/cchat',
                    data: data1,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    cache: 'false'
                });
                return $q.all([promise1, promise2]).then(function (data) {
                    console.log(data[0], data[1]);
                    return 0;
                }, function onError(response) {
                    console.log(response);

                });
            });

        }
    }
    return sdo;

}]);