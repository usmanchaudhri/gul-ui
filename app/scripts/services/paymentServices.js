/**
 * Created by Khan on 7/13/2016.
 */
app.factory('paymentServices', [ 'restServices','cartServices','paypalPaymentServices','$cookies', function ( restServices,cartServices,paypalPaymentServices,$cookies) {

    var sdo = {


        submitPayment: function (totalPrice, payload) {

            if ($cookies.get("username") != null) {
                var invoice = JSON.parse($cookies.get("invoices"));
                return cartServices.cartItemsTotalPrice(invoice).then(function(data){
                    if (data > 0) {
                        return restServices.getToken().then(function (data) {
                            console.log("Paypal Data",data.access_token);
                            $cookies.put("tokenID", data.access_token);
                            var tokenID = $cookies.get("tokenID");
                            return paypalPaymentServices.submitPayment(data,payload,tokenID).then(function (data) {
                                console.log("response data",data);
                                return "success";
                                },function(result) {
                                console.log("response error data",result);
                                return "error";
                            });
                        });

                    } else {
                        alert("Cart is Empty");
                        return "";
                    }
                });
            } else {
                $rootScope.$emit("signin", {});
                return "";
            }
        }

    }
    return sdo;

}]);