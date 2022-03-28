const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLID = require('graphql').GraphQLID;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLInt = require('graphql').GraphQLInt;
const CourseModel = require('../model/courseModel');
const StudentModel = require('../model/studentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a GraphQL Object Type for course model
const courseType = new GraphQLObjectType({
	name: 'course',
	fields: function () {
		return {
			_id: {
				type: GraphQLID,
			},
			coursecode: {
				type: GraphQLString,
			},
			coursename: {
				type: GraphQLString,
			},
			section: {
				type: GraphQLString,
			},
			semester: {
				type: GraphQLString,
			},
			student: {
				type: GraphQLList(GraphQLString),
			},
		};
	},
});

// Create a GraphQL Object Type for login response
const loginType = new GraphQLObjectType({
	name: 'login',
	fields: function () {
		return {
			email: {
				type: GraphQLString,
			},
			password: {
				type: GraphQLString,
			},
			token: {
				type: GraphQLString,
			},
		};
	},
});

// Create a GraphQL Object Type for choose course response
const chooseCourseType = new GraphQLObjectType({
	name: 'choosecourse',
	fields: function () {
		return {
			message: {
				type: GraphQLString,
			},
		};
	},
});

const studentType = new GraphQLObjectType({
	name: 'student',
	fields: function () {
		return {
			_id: {
				type: GraphQLID,
			},
			studentnumber: {
				type: GraphQLInt,
			},
			firstname: {
				type: GraphQLString,
			},
			lastname: {
				type: GraphQLString,
			},
			email: {
				type: GraphQLString,
			},
			phone: {
				type: GraphQLString,
			},
			password: {
				type: GraphQLString,
			},
			city: {
				type: GraphQLString,
			},
			address: {
				type: GraphQLString,
			},
			program: {
				type: GraphQLString,
			},
		};
	},
});

// create a GraphQL query type that returns all course or a course by id
const queryType = new GraphQLObjectType({
	name: 'Query',
	fields: function () {
		return {
			courses: {
				type: new GraphQLList(courseType),
				resolve: function () {
					const courses = CourseModel.find().exec();
					if (!courses) {
						throw new Error('Course Not Found');
					}
					return courses;
				},
			},
			selectedCourses: {
				type: new GraphQLList(courseType),
				resolve: function (root, params, req) {
					console.log('User Id', req.userId);
					console.log('Req Data', req.isAuth);

					const courses = CourseModel.find({ student: req.userId });
					if (!courses) {
						throw new Error('No Any Course You Have Selected');
					}
					return courses;
				},
			},
			course: {
				type: courseType,
				args: {
					id: {
						name: '_id',
						type: GraphQLID,
					},
				},
				resolve: function (root, params) {
					const courseInfo = CourseModel.findById(params.id).exec();
					if (!courseInfo) {
						throw new Error('Course Not Found');
					}
					return courseInfo;
				},
			},
			students: {
				type: new GraphQLList(studentType),
				resolve: function (req) {
					const students = StudentModel.find().exec();
					if (!students) {
						throw new Error('Student Not Found');
					}
					return students;
				},
			},
		};
	},
});

// add mutations for CRUD operations
const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: function () {
		return {
			addCourse: {
				type: courseType,
				args: {
					coursecode: {
						type: new GraphQLNonNull(GraphQLString),
					},
					coursename: {
						type: new GraphQLNonNull(GraphQLString),
					},
					section: {
						type: new GraphQLNonNull(GraphQLString),
					},
					semester: {
						type: new GraphQLNonNull(GraphQLString),
					},
				},
				resolve: async function (root, params) {
					const courseExist = await CourseModel.findOne({
						coursecode: params.coursecode,
					});
					if (courseExist) {
						throw new Error('Course Already Exist!!');
					}
					const courseModel = new CourseModel(params);
					const newCourse = courseModel.save();
					if (!newCourse) {
						throw new Error('Course Not Added!!');
					}
					return newCourse;
				},
			},
			chooseCourse: {
				type: chooseCourseType,
				args: {
					id: {
						type: new GraphQLNonNull(GraphQLID),
					},
				},
				resolve: async function (root, params, { isAuth, userId }) {
					console.log('User Id', userId);
					console.log('Req Data', isAuth);
					if (!isAuth) {
						throw new Error('Unauthorized Login First!!');
					}
					const courseid = params.id;

					const course = await CourseModel.findOne({ _id: courseid });
					if (!course) {
						throw new Error('Course Not Exist!!');
					}
					if (userId) {
						course.student.push(userId);
					}
					await course.save();
					return {
						message: 'Course Selected Successfully!!',
					};
				},
			},
			updateCourse: {
				type: courseType,
				args: {
					id: {
						name: 'id',
						type: new GraphQLNonNull(GraphQLID),
					},
					coursecode: {
						type: new GraphQLNonNull(GraphQLString),
					},
					coursename: {
						type: new GraphQLNonNull(GraphQLString),
					},
					section: {
						type: new GraphQLNonNull(GraphQLString),
					},
					semester: {
						type: new GraphQLNonNull(GraphQLString),
					},
				},
				resolve: async function (root, params) {
					const courseExist = await CourseModel.findById({ _id: params.id });
					if (!courseExist) {
						throw new Error('Course Not Found!!');
					}
					const course = await CourseModel.findByIdAndUpdate(params.id, {
						coursecode: params.coursecode,
						coursename: params.coursename,
						section: params.section,
						semester: params.semester,
					});
					return course;
				},
			},
			deleteCourse: {
				type: courseType,
				args: {
					id: {
						type: new GraphQLNonNull(GraphQLID),
					},
				},
				resolve: async function (root, params) {
					const courseExist = await CourseModel.findById({ _id: params.id });
					if (!courseExist) {
						throw new Error('Course Not Found!!');
					}
					const deletedCourse = await CourseModel.findByIdAndRemove(
						params.id
					).exec();
					if (!deletedCourse) {
						throw new Error('Course Not Deleted');
					}
					return deletedCourse;
				},
			},
			addStudent: {
				type: studentType,
				args: {
					studentnumber: {
						type: new GraphQLNonNull(GraphQLInt),
					},
					firstname: {
						type: new GraphQLNonNull(GraphQLString),
					},
					lastname: {
						type: new GraphQLNonNull(GraphQLString),
					},
					email: {
						type: new GraphQLNonNull(GraphQLString),
					},
					phone: {
						type: new GraphQLNonNull(GraphQLString),
					},
					password: {
						type: new GraphQLNonNull(GraphQLString),
					},
					city: {
						type: new GraphQLNonNull(GraphQLString),
					},
					address: {
						type: new GraphQLNonNull(GraphQLString),
					},
					program: {
						type: new GraphQLNonNull(GraphQLString),
					},
				},
				resolve: async function (root, params) {
					const studentExist = await StudentModel.findOne({
						studentnumber: params.studentnumber,
						email: params.email,
					});
					if (studentExist) {
						throw new Error('Student Email & Number Already Exist!!');
					}
					const salt = await bcrypt.genSalt(10);
					const hashedPassword = await bcrypt.hash(params.password, salt);

					const studentData = new StudentModel({
						studentnumber: params.studentnumber,
						firstname: params.firstname,
						lastname: params.lastname,
						email: params.email,
						phone: params.phone,
						password: hashedPassword,
						city: params.city,
						address: params.address,
						program: params.program,
					});

					// const studentModel = new StudentModel(params);
					const newStudent = studentData.save();
					if (!newStudent) {
						throw new Error('Student Not Added!!');
					}
					return newStudent;
				},
			},
			updateStudent: {
				type: studentType,
				args: {
					id: {
						name: 'id',
						type: new GraphQLNonNull(GraphQLID),
					},
					studentnumber: {
						type: new GraphQLNonNull(GraphQLInt),
					},
					firstname: {
						type: new GraphQLNonNull(GraphQLString),
					},
					lastname: {
						type: new GraphQLNonNull(GraphQLString),
					},
					email: {
						type: new GraphQLNonNull(GraphQLString),
					},
					phone: {
						type: new GraphQLNonNull(GraphQLString),
					},
					password: {
						type: new GraphQLNonNull(GraphQLString),
					},
					city: {
						type: new GraphQLNonNull(GraphQLString),
					},
					address: {
						type: new GraphQLNonNull(GraphQLString),
					},
					program: {
						type: new GraphQLNonNull(GraphQLString),
					},
				},
				resolve: async function (root, params) {
					const studentExist = await StudentModel.findById({ _id: params.id });
					if (!studentExist) {
						throw new Error('Student Not Found!!');
					}
					const student = await StudentModel.findByIdAndUpdate(
						params.id,
						{
							studentnumber: params.studentnumber,
							firstname: params.firstname,
							lastname: params.lastname,
							email: params.email,
							phone: params.phone,
							city: params.city,
							address: params.address,
							program: params.program,
						},
						{ new: true }
					);
					return student;
				},
			},
			deleteStudent: {
				type: studentType,
				args: {
					id: {
						type: new GraphQLNonNull(GraphQLID),
					},
				},
				resolve: async function (root, params) {
					const studentExist = await StudentModel.findById({ _id: params.id });
					if (!studentExist) {
						throw new Error('Student Not Found!!');
					}
					const deleteStudent = await StudentModel.findByIdAndRemove(
						params.id
					).exec();
					if (!deleteStudent) {
						throw new Error('Student Not Deleted');
					}
					return deleteStudent;
				},
			},
			login: {
				type: loginType,
				args: {
					email: {
						type: new GraphQLNonNull(GraphQLString),
					},
					password: {
						type: new GraphQLNonNull(GraphQLString),
					},
				},
				resolve: async function (root, params) {
					const student = await StudentModel.findOne({ email: params.email });

					if (!student) {
						throw new Error('Invalid Email or Password!!');
					}

					let isMatch = bcrypt.compareSync(params.password, student.password);

					if (!isMatch) {
						throw new Error('Invalid Email or Password!!');
					}

					if (student && isMatch) {
						const studentId = student.id;
						const token = jwt.sign({ studentId }, 'jwtsecret@@12345', {
							expiresIn: '30d',
						});
						// console.log('Student', student);
						// console.log('Token', token);
						return {
							email: student.email,
							token: token,
						};
					} else {
						throw new Error('Invalid Email or Password!!');
					}
				},
			},
		};
	},
});

// export query and mutation (graphql Schema)
module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
