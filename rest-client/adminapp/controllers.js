adminApp.controller('RestaurantListController', function ($scope, $http) {
  $http({
    method: 'GET',
    url: '/admin/restaurants'
  })
  .success(function (data, status, headers, config) {
    $scope.restaurants = data;
  })
  .error(function (data, status, headers, config) {
    alert('error: ' + data);
  });
});

adminApp.controller('RestaurantAddController', function ($scope, $http) {
  
});

adminApp.controller('RestaurantDetailController', function ($scope, $routeParams, $http) {
  $scope.restaurant = mydata[$routeParams.rest_id];
});