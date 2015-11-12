var mongoose = require('mongoose');
var app = require('express')();
var tasksRouter = require(__dirname + '/routes/tasks_routes');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/tasks_db_dev');

app.use('/api', tasksRouter);

app.listen(3000, function() {
  console.log('server up');
});
