
app.factory('apiFactoryExampleService', [function () {
    var value = 10;
    var sdo = {};        
    var sdo = {        
        getValue: function() {
            return value;
        }        
    }    
    return sdo;    
}]);

