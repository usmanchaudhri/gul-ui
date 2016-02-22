require.config({
  paths: {
      'angular' : 'angular',
      'ngResource': 'angular-resource',
      'ngCookies': 'angular-cookies',
  },
  shim: {
      ngResource: {
          deps: ['angular'],
          exports: 'angular'
      },
      ngCookies: {
          deps: ['angular'],
          exports: 'angular'
      },
      angular: {
          exports : 'angular'
      }
  },
  baseUrl: '/js'
});

require(['app'], function (app) {
  app.init();
});