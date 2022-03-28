const mongoose = require('mongoose');

// Declare the student Schema
const studentSchema = new mongoose.Schema({
	studentnumber: {
		type: Number,
		required: true,
	},
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	program: {
		type: String,
		required: true,
	},
	// courses: [
	//   {
	//     type: mongoose.Schema.Types.ObjectId,
	//     ref: 'Course',
	//   },
	// ],
});

//Export the model
module.exports = mongoose.model('Student', studentSchema);
