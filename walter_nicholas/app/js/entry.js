require('angular/angular');
var angular = window.angular;

var taskApp = angular.module('taskApp', []);
// require('./controllers/controllers')(taskApp);
require('./tasks/tasks')(taskApp);
