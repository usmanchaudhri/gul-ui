/**
 * Created by Khan on 6/2/2016.
 */
app.factory('utilityServices', ['$q', function ($q) {
    var sdo = {
        isImage: function (src) {
            var deferred = $q.defer();

            var image = new Image();
            image.onerror = function () {
                deferred.resolve(false);
            };
            image.onload = function () {
                deferred.resolve(true);
            };
            image.src = src;

            return deferred.promise;
        },

        menuColor: function (breadcrumbs) {
            var deferred = $q.defer();
            var breadcrumbLength = breadcrumbs.get().length;
            if (breadcrumbLength > 1) {
                var value = {
                    "enableBorder": "1px solid #E2E2E2",
                    "menuColor": "black",
                    "menuMargin": "125px"
                }
                deferred.resolve(value);

            } else {
                var value = {
                    "enableBorder": "none",
                    "menuColor": "white",
                    "menuMargin": "0px"
                }
                deferred.resolve(value);
            }
            console.log("CALLED");
            return deferred.promise;
        },

        getShop: function(mName,categoryIDs){
            var deferred = $q.defer();
            for (var i = 0; i < categoryIDs.length; i++) {
                if (mName == categoryIDs[i].name) {
                    //return categoryIDs[i].id;
                    deferred.resolve(categoryIDs[i].id);
                }
            }
            return deferred.promise;
        }

    }
    return sdo;
}]);