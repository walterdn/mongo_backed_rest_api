var angular = window.angular;

module.exports = function(app) {
  app.controller('tasksController', ['$scope', '$http', function($scope, $http) {
  	$scope.tasks = [];
    $scope.defaults = {location: 'work', priority: 1};
    $scope.newTask = angular.copy($scope.defaults);
    $scope.token = false;
    $scope.username = '';
    $scope.taskEditing = false;

    // var tasksResource = cfResource('tasks');

    $scope.signUp = function() {
      $scope.username = $('input[id="newUsername"]').val();
      var password = $('input[id="newPassword"]').val();
      var repeated = $('input[id="repeated"]').val();
      if(!($scope.username != '' && password != '' && repeated != '')) alert('Fill out all fields');
      else if(repeated != password) alert('password != repeated');
      else {
        var newUser = {"username": $scope.username, "password": password};
        
        var successCb = function(res) {
          if(res.data.token) $scope.token = res.data.token;
        };
        var errorCb = function(err) {
          console.log(err.data.msg);
          alert(err.data.msg);
        };

        var req = {
          method: 'POST',
          url:'/api/signup',
          data: newUser
        };

        $http(req).then(successCb, errorCb);
      } 
    };

    // $scope.signIn = function() {
    //   $scope.username = $('input[id="username"]').val();
    //   var password = $('input[id="password"]').val();
    //   if(!($scope.username != '' && password != '')) alert('Fill out all fields.');
    //   else {

    //     var successCb = function(res) {
    //       if(res.data.token) $scope.token = res.data.token;
    //     };

    //     var errorCb = function(err) {
    //       console.log(err.data)
    //     };

    //     var user = $scope.username;
    //     var req = {
    //       method: 'GET',
    //       url: '/api/signin'
    //       headers: {"Authorization": "Basic " + btoa(user + ":" + password)}
    //     };

    //     $http(req).then(successCb, errorCb);

        // var newUser = {"username": $scope.username, "password": password};
        // $http.post('/api/signup', newUser)
        //   .then(function(res) {
        //     if(res.data.token) $scope.token = res.data.token;
        //   }, function(err) {
        //     console.log(err.data)
        //   });
    //   } 
    // };
    

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
          $scope.newTask = Object.create($scope.defaults);
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

    $scope.toggleEditing = function() {
      if($scope.taskEditing) $scope.taskEditing = false;
      else $scope.taskEditing = true;
    }

    $scope.deleteTask = function(task) {
      if(!($scope.token)) alert('Must be logged in to delete tasks.');
      else {
        $scope.tasks.splice($scope.tasks.indexOf(task), 1);

        var successCb = function(res) {
          console.log('task deleted.')
        };

        var errorCb = function(err) {
          console.log(err.data.msg);
          $scope.retrieveTasks();
        };

        var req = {
          method: 'POST',
          url:'/api/tasks/delete/' + task._id,
          data: {token: $scope.token}
        };

        $http(req).then(successCb, errorCb);
  
      }
    };
  }]);
};