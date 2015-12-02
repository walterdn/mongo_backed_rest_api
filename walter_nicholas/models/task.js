var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
  description: String,
  location: {type: String, default: 'work'},
  deadline: Date,
  priority: {type: Number, min: 1, max: 5, default: 1},
  completed: {type: Boolean, default: false}
});

var Task = module.exports = mongoose.model('Task', taskSchema);

Task.schema.path('location').validate(function (value) {
  return /home|work|school|other/i.test(value);
}, 'Invalid location');







//permitted SchemaTypes: String, Number, Date, Buffer,
//Boolean, Mixed, Objectid, Array

//time frame attribute-- how?