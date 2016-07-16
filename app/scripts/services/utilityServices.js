/**
 * Created by Khan on 6/2/2016.
 */

app.factory('Base64', function () {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});

app.factory('DataLoader', function ($http) {

    return {
        post: function (url) {
            return $http.jsonp(url);
        },
        getAuth: function (base64, url, postData) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + base64;

            var req = {
                method: 'POST',
                url: url,
                data: postData

            }

            return $http(req);
        },
    }
});

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

