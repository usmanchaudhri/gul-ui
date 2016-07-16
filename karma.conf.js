// Karma configuration
// Generated on Wed Jun 01 2016 08:10:03 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-jquery','jasmine'],

    // list of files / patterns to load in the browser
    files: [
        'bower_components/jquery/dist/jquery.js',        
        'bower_components/angular/angular.js',        
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-cookies/angular-cookies.js',
        'bower_components/angular-route/angular-route.js',
        // 'bower_components/ng-infinite-scroll/ng-infinite-scroll.js',
        'app/scripts/js/ngInfiniteScroll.js',
        'app/scripts/js/ng-breadcrumbs.js',
        'app/scripts/js/ng-file-upload.js',
        'app/scripts/js/angular-bootstrap-lightbox.js',
        'app/scripts/js/ui-bootstrap-0.11.0.min.js',
        'app/scripts/js/angular-image-cropper.min.js',
        'app/scripts/js/loading-bar.min.js',
        // 'bower_components/angular-sanitize/angular-sanitize.js',
        // 'bower_components/angular-touch/angular-touch.js',

        'app/scripts/controller/myApp.js',
        'app/scripts/services/restServices.js',
        'app/scripts/services/cartServices.js',
       //  'app/controller/services-test.js',
        'app/scripts/services/utilityServices.js',
        'app/scripts/services/orderServices.js',
        'app/scripts/services/paymentServices.js',
        'app/scripts/services/paypalPaymentServices.js',
        'app/scripts/services/accountServices.js',


        //'test/**/cartServicesSpec.js',
        //'test/**/orderServicesSpec.js',
        //'test/**/paymentServicesSpec.js',
        'test/**/accountServicesSpec.js',
        {pattern: 'test/mock/*.json', watched: true, served: true, included: false}
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
