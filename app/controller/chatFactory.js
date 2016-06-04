/**
 * Created by Khan on 6/2/2016.
 */
app.factory('loginFactory', [ '$rootScope', 'apiFactory', function ( $rootScope, apiFactory) {

    var sdo = {
        regUserTwilio: function (user) {
            var data = $.param({
                Identity: user
            });
            apiFactory.getUrls().then(function (response) {
                var url = response.data.twilioUser;
                apiFactory.postTwilioData(url, data)
                    .then(function (data) {
                        return data;
                    });
            });
        }
    }
    return sdo;
}]);