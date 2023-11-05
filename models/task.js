const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;