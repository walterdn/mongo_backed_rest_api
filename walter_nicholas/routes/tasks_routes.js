var express = require('express');
var bodyParser = require('body-parser');

var Task = require(__dirname + '/../models/task');
var tasksRouter = express.Router();
module.exports = exports = tasksRouter;

tasksRouter.get('/tasks', function(req, res) {
  Task.find({}, function(err, data) {
    if (err) return function(err, res) {
      res.status(500).json({msg: 'Server error.'});
    };

    res.json(data);
  });
});

tasksRouter.get('/tasks/priority/:num', function(req, res) {
  Task.find({priority : { $lt: (parseInt(req.params.num) + 1)}}, function(err, data) { //finds all tasks with priority less than or equal to route specified by :num
    if (err) return function(err, res) {
      res.status(500).json({msg: 'Server error.'});
    };

    res.json(data);
  });
});

tasksRouter.get('/tasks/location/:loc', function(req, res) {
  Task.find({location : req.params.loc}, function(err, data) {
    if (err) return function(err, res) {
      res.status(500).json({msg: 'Server error.'});
    };

    res.json(data);
  });
});

tasksRouter.post('/tasks', bodyParser.json(), function(req, res) {
  var newTask = new Task(req.body);
  newTask.save(function(err, data) {
    if (err) return function(err, res) {
      res.status(500).json({msg: 'Server error.'});
    };
    
    res.json(data);
  });
});

tasksRouter.put('/tasks/:id', bodyParser.json(), function(req, res) {
  var taskData = req.body;
  delete taskData._id;
  Task.update({_id: req.params.id}, taskData, function(err) {
    if (err) return function(err, res) {
      res.status(500).json({msg: 'Server error.'});
    };
    
    res.json({msg: 'Task modified.'});
  });
});

tasksRouter.delete('/tasks/:id', function(req, res) {
  Task.remove({_id: req.params.id}, function(err) {
    if (err) return function(err, res) {
      res.status(500).json({msg: 'Server error.'});
    };
    
    res.json({msg: 'Task deleted.'});
  });
});

