var adminApp = angular.module('adminApp', ['ngRoute']);

adminApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/restaurants', {
      templateUrl: '/adminapp/partials/rest-list.html',
      controller: 'RestaurantListController'
    })
    .when('/restaurant/:rest_id', {
      templateUrl: '/adminapp/partials/rest-detail.html',
      controller: 'RestaurantDetailController'
    })
    .otherwise({
      redirectTo: '/restaurants'
    });
}]);