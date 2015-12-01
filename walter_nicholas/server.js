var mongoose = require('mongoose');
var app = require('express')();
var userRouter = require(__dirname + '/routes/user_routes');
var taskRouter = require(__dirname + '/routes/task_routes');
process.env.APP_SECRET = process.env.APP_SECRET || 'changethislaterforsomereason';

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/tasks_db_dev');

app.use('/api', userRouter);
app.use('/api', taskRouter);

app.listen(3000, function() {
  console.log('server up');
});
