module.exports = function(app) {
  app.controller('tasksController', ['$scope', '$http', function($scope, $http) {
  	$scope.tasks = [];

  	$scope.retrieveTasks = function() {
      $http.get('/api/tasks')
        .then(function(res) {
          $scope.tasks = res.data;
        }, function(err) {
          console.log(err.data);
        });
    };

  }]);
};