require(__dirname + '/../../app/js/entry');
require('angular-mocks');

describe('tasks controller', function() {
  var $httpBackend;
  var $ControllerConstructor;
  var $scope;

  beforeEach(angular.mock.module('taskApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $ControllerConstructor = $controller;
  }));

  it('should be able to create a controller', function() {
    var controller = $ControllerConstructor('tasksController', {$scope: $scope});
    expect(typeof $scope).toBe('object');
    expect(typeof controller).toBe('object');
    expect(Array.isArray($scope.tasks)).toBe(true);
  });

  describe('REST request functions', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      $ControllerConstructor('tasksController', {$scope: $scope});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should populate scope.tasks array with by running retrieveTasks()', function() {
      $httpBackend.expectGET('/api/tasks').respond(200, [{_id: 1, description: 'test task'}]);
      $scope.retrieveTasks();
      $httpBackend.flush();
      expect($scope.tasks[0].description).toBe('test task');
    });

    it('should be able to create a new task', function() {
      $httpBackend.expectPOST('/api/tasks', {description: 'test task', location: 'work', priority: 1}).respond(200, {description: 'a different task'});
      expect($scope.tasks.length).toBe(0);
      expect($scope.newTask).toEqual($scope.defaults);      
      $scope.newTask.description = 'test task';
      $scope.createTask($scope.newTask);
      $httpBackend.flush();
      expect($scope.tasks[0].description).toBe('a different task');
    });

    it('should be able to modify a task', function() {
      $httpBackend.expectGET('/api/tasks').respond(200, [{_id: 1, description: 'test task', completed: false}]);
      $scope.retrieveTasks();
      $httpBackend.flush();
      
      $httpBackend.expectPUT('/api/tasks/1').respond(200, [{_id: 1, description: 'test task', completed: false}]);
      expect($scope.tasks[0].completed).toBe(false);
      $scope.updateTask($scope.tasks[0]);
      $httpBackend.flush();
      expect($scope.tasks[0].completed).toBe(true);
    });

    it('should be able to delete a task', function() {
      $httpBackend.expectGET('/api/tasks').respond(200, [{_id: 1, description: 'test task'}]);
      $scope.retrieveTasks();
      $httpBackend.flush();
      
      $httpBackend.expectPOST('/api/tasks/delete/1').respond(200, [{_id: 1, description: 'test task'}]);
      expect($scope.tasks[0].description).toBe('test task');
      $scope.token = true;
      $scope.deleteTask($scope.tasks[0]);
      $httpBackend.flush();
      expect($scope.tasks[0]).toBe(undefined);
    });
  });
});