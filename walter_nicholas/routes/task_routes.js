var express = require('express');
var bodyParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_error');
var Task = require(__dirname + '/../models/task');
var taskRouter = module.exports = exports = express.Router();
var eatAuth = require(__dirname + '/../lib/eat_auth');

taskRouter.get('/tasks', function (req, res) {
  Task.find({}, function (err, data) {
    if (err) return handleError(err, res); 

    res.json(data);
  });
});

taskRouter.get('/tasks/priority/:num', function (req, res) {
  Task.find({priority : { $lt: (parseInt(req.params.num) + 1)}}, function(err, data) { //finds all tasks with priority less than or equal to route specified by :num
    if (err) return handleError(err, res); 

    res.json(data);
  });
});

taskRouter.get('/tasks/completed/:status', function (req, res) {
  Task.find({completed : req.params.status}, function(err, data) {
    if (err) return handleError(err, res); 

    res.json(data);
  });
});

taskRouter.get('/tasks/location/:loc', function (req, res) {
  Task.find({location : req.params.loc}, function(err, data) {
    if (err) return handleError(err, res); 

    res.json(data);
  });
});

taskRouter.post('/tasks', bodyParser, function (req, res) {
  var newTask = new Task(req.body);
  newTask.save(function(err, data) {
    if (err) return handleError(err, res); 

    res.json(data);
  });
});

taskRouter.put('/tasks/:id', bodyParser, function (req, res) {
  var taskData = req.body;
  delete taskData._id;
  Task.update({_id: req.params.id}, taskData, function (err) {
    if (err) return handleError(err, res); 

    res.json({msg: 'Task modified.'});
  });
});

taskRouter.delete('/tasks/:id', function (req, res) {
  Task.remove({_id: req.params.id}, function (err) {
    if (err) return handleError(err, res);

    res.json({msg: 'Task deleted.'});
  });
});

// taskRouter.delete('/tasks/:id', bodyParser, eatAuth, function (req, res) {
//   Task.remove({_id: req.params.id}, function (err) {
//     if (err) return handleError(err, res);

//     res.json({msg: 'eat auth success!'});
//   });
// });

