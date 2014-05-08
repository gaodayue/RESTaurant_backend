var adminApp = angular.module('adminApp', ['ngRoute']);

adminApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/restaurants', {
      templateUrl: '/adminapp/partials/rest-list.html',
      controller: 'RestaurantListController'
    })
    .when('/restaurants/add', {
      templateUrl: '/adminapp/partials/rest-add.html',
      controller: 'RestaurantAddController'
    })
    .when('/restaurant/:rest_id', {
      templateUrl: '/adminapp/partials/rest-edit.html',
      controller: 'RestaurantDetailController'
    })
    .otherwise({
      redirectTo: '/restaurants'
    });
}]);