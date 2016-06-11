
'use strict'

describe('apiFactorySpec', function() {    
    var factory, http;
    
    beforeEach(function() {
        module('myApp');      
        // the below provider causes an issue with 'prototype'  
        // module(function($provide) {
        //     $provide.service('apiFactory', factory);
        // });
    });
    
    beforeEach(inject(function($rootScope, $injector) {
        factory = $injector.get('apiFactory');
    }));
    
    
    describe('test api factory get value', function() {
	    it("should get the value", function() {
            var value = factory.getValue();
            expect(value).toBe(10);
		});        
    });
    
    describe('apiFactoryService get url', function() {        
        it("should get the value of url", function() {
            var producturl;
            factory.getUrls().then(function(response) {
                producturl = response.data.productUrl;
            });
            console.log("Product Url: " + producturl);                    
            // expect(urls).toBeDefined();
            // console.log("Urls:" + urls.data);
            // console.log("Category Urls:" + urls.categoryUrl);            
        });        
	});
    
    describe('getting shop info', function() {
        it("should get the shop info", function() {
            var shop = factory.getShop(10);
            var shopId = shop.details;
            console.log("Shop :" + shop.categoryUrl);
            console.log("Shop[0] :" + shop[0]);
            console.log("Shop[1] :" + shop[1]);
            console.log("Shop detail :" + shopId);            
            expect(shop).toBeDefined();
        });
    });
    
});
