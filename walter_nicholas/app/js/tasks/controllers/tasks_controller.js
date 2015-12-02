module.exports = function(app) {
  app.controller('tasksController', ['$scope', '$http', function($scope, $http) {
  	$scope.tasks = [];
  	var defaults = {location: 'work', priority: 1};	
    $scope.newTask = Object.create(defaults);

    $scope.showTasksByPriority = function() {
			var priority = $('select[id="priority"]').val();

    	$http.get('/api/tasks/priority/' + priority)
        .then(function(res) {
          $scope.tasks = res.data;
        }, function(err) {
          console.log(err.data);
        });
    };

    $scope.showTasksByCompletion = function() {
			var status = $('select[id="completionStatus"]').val();

    	$http.get('/api/tasks/completed/' + status)
        .then(function(res) {
          $scope.tasks = res.data;
        }, function(err) {
          console.log(err.data);
        });
    };

    $scope.createTask = function(task) {
      $http.post('/api/tasks', task)
        .then(function(res) {
          $scope.tasks.push(res.data);
          $scope.newTask = Object.create(defaults);
        }, function(err) {
          console.log(err.data)
        });
    };

  	$scope.retrieveTasks = function() {
      $http.get('/api/tasks')
        .then(function(res) {
          $scope.tasks = res.data;
        }, function(err) {
          console.log(err.data);
        });
    };

    $scope.updateTask = function(task) {
    	if(task.completed) task.completed = false;
    	else task.completed = true;
      $http.put('/api/tasks/' + task._id, task)
        .then(function(res) {
          console.log('task completion status updated.');
        }, function(err) {
          console.log(err.data);
        });
    };

    $scope.deleteTask = function(task) {
      $scope.tasks.splice($scope.tasks.indexOf(task), 1);
      $http.delete('/api/tasks/' + task._id)
        .then(function(res) {
          console.log('task deleted');
        }, function(err) {
          console.log(err.data);
          $scope.retrieveTasks();
        });
    };

  }]);
};