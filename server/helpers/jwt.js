const jwt = require('jsonwebtoken');
const Student = require('../model/studentModel');

const verifyToken = async (req, res, next) => {
	// console.log('req', req);
	const authToken = req.get('Authorization');
	if (!authToken) {
		req.isAuth = false;
		return next();
	}
	// console.log('auth token ', authToken);
	let verify;
	try {
		verify = jwt.verify(authToken, 'jwtsecret@@12345');
	} catch (error) {
		req.isAuth = false;
		return next();
	}
	// console.log('Verify Data', verify);
	if (!verify.studentId) {
		req.isAuth = false;
		return next();
	}
	const user = await Student.findById(verify.studentId).select('-password');
	// console.log('User Details', user);
	if (!user) {
		req.isAuth = false;
		return next();
	}
	req.userId = user._id;
	req.isAuth = true;
	// console.log('Request', req);
	return next();
};

module.exports = verifyToken;
