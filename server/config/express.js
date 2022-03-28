// Load the module dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// Define the Express configuration method
const app = express();

// Use the middleware functions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (req, res) => {
	res.status(200).json({ message: 'App Running!!' });
});

module.exports = app;
