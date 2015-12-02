var mongoose = require('mongoose');
var fs = require('fs');
var express = require('express');
var app = require('express')();
var userRouter = require(__dirname + '/routes/user_routes');
var taskRouter = require(__dirname + '/routes/task_routes');
process.env.APP_SECRET = process.env.APP_SECRET || 'changethislaterforsomereason';

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/tasks_db_dev');

app.use('/api', userRouter);
app.use('/api', taskRouter);

app.use(express.static('build'));
app.get('/', function (req, res) { 
  res.send((fs.readFileSync(__dirname + '/build/index.html')).toString());
});

app.listen(3000, function() {
  console.log('server up');
});
