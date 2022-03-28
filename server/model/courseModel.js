const mongoose = require('mongoose');

// Declare the course Schema
const courseSchema = new mongoose.Schema({
  coursecode: {
    type: String,
    required: true,
  },
  coursename: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
  ],
});

//Export the model
module.exports = mongoose.model('Course', courseSchema);
