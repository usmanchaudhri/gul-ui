/**
 * Created by Khan on 7/13/2016.
 */
app.factory('categoryServices', [ 'restServices','utilityServices', function ( restServices,utilityServices) {

    var sdo = {


        getCategory: function (cat_id) {
            return restServices.getUrls()
                .then(function (response) {
                    var url = response.data.categoryUrl + '/' + cat_id;
                    return restServices.getApiData(url)
                        .then(function (data) {
                            console.log("SINGLE CAT before: ",data);

                            return utilityServices.isImage(response.data.fixImagePath + 'category/banner_' + cat_id + '.jpg' + response.data.token).then(function (result) {
                                console.log("SINGLE CAT CTRL: ",result);
                                value = {
                                    urls: response.data,
                                    banner: result,
                                    fixPath: response.data.fixImagePath,
                                    token: response.data.token,
                                    categoryLength: data.data.subCategories.length,
                                    categoryDetail: data.data
                                };
                                console.log("SINGLE CAT CTRL: ",value);
                                return value;
                            });
                        });
                });
        },

        getCategoryProduct: function (cat_id) {

            return restServices.getUrls()
                .then(function (response) {
                    var url = response.data.categoryUrl + '/' + cat_id + '/products';
                    var mFixPath = response.data.fixPath;
                    var mToken = response.data.token;
                    return restServices.getApiData(url)
                        .then(function (response1) {
                            var categoryIDs = [];
                            var categoryProDetail = [];
                            var data = response1.data.products;
                            var dataLength = data.length;
                            for (var i = 0; i < dataLength; i++) {
                                var shopName = '';
                                if (angular.isObject(data[i].shop)) {
                                    shopName = data[i].shop.name;
                                    var value = {
                                        "id": data[i].shop.id,
                                        "name": data[i].shop.name
                                    };
                                    categoryIDs.push(value);
                                } else {
                                    shopName = data[i].shop;

                                }
                                var value = {
                                    "name": data[i].name,
                                    "id": data[i].id,
                                    "shortDesc": data[i].shortDesc,
                                    "longDesc": data[i].longDesc,
                                    "quantity": data[i].quantity,
                                    "pricingProduct": data[i].pricingProduct,
                                    "category": {
                                        "id": data[i].category.id,
                                        "code": data[i].category.code,
                                        "name": data[i].category.name,
                                        "createdOn": data[i].category.createdOn,
                                    },
                                    "shop": shopName,
                                    "productVariation": data[i].productVariation,
                                    "attributeDefinitions": data[i].attributeDefinitions,
                                    "imageInfo": data[i].imageInfo,
                                    "createdOn": data[i].createdOn
                                };
                                categoryProDetail.push(value);
                                data = data[i].category.products;
                            }
                            return utilityServices.isImage(mFixPath + 'category/banner_' + cat_id + '.jpg' + mToken).then(function (result) {
                                value = {
                                    banner: result,
                                    urls: response.data,
                                    fixPath: response.data.fixImagePath,
                                    token: response.data.token,
                                    categoryProDetail: categoryProDetail,
                                    categoryIDs: categoryIDs
                                };
                                return value;

                            });


                        });


                });


        }
    }
    return sdo;

}]);