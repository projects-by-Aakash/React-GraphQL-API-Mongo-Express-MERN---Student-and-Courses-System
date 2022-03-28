import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { gql, useMutation } from '@apollo/client';

const ADD_COURSE = gql`
	mutation addCourse(
		$coursecode: String!
		$coursename: String!
		$section: String!
		$semester: String!
	) {
		addCourse(
			coursecode: $coursecode
			coursename: $coursename
			section: $section
			semester: $semester
		) {
			_id
			coursecode
			coursename
			section
			semester
		}
	}
`;

const AddCourse = () => {
	const [courseCode, setCourseCode] = useState('');
	const [courseName, setCourseName] = useState('');
	const [section, setSection] = useState('');
	const [semester, setSemester] = useState('');

	const clearState = () => {
		setCourseCode('');
		setCourseName('');
		setSection('');
		setSemester('');
	};

	const [addCourse, { loading }] = useMutation(ADD_COURSE);

	// if (loading) return 'Submitting...';
	// if (error) return `Submission error! ${error.message}`;

	const handlesubmit = async (e) => {
		e.preventDefault();
		if (
			courseCode === '' ||
			courseName === '' ||
			section === '' ||
			semester === ''
		) {
			toast.error('Please Fill Course Details!!');
		} else {
			addCourse({
				variables: {
					coursecode: courseCode,
					coursename: courseName,
					section: section,
					semester: semester,
				},
			})
				.then(() => {
					toast.success('Course Added');
					clearState();
				})
				.catch((error) => {
					toast.error(error.message);
				});
		}
	};

	if (loading)
		return (
			<Container className='my-3 py-3'>
				<p>Submitting...</p>
			</Container>
		);

	return (
		<div>
			<Container className='my-3 py-3'>
				<Row>
					<Col md={{ span: 4, offset: 4 }} className='p-4 custom-shadow' style={{background:"lightGrey"}}>
						<h4 className='text-center'>Add Course</h4>
						<Form className='my-3' onSubmit={handlesubmit} id='courseform'>
							<Form.Group className='mb-3'>
								<Form.Label>Course Code</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter Course Code'
									name='coursecode'
									onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
								/>
							</Form.Group>

							<Form.Group className='mb-3'>
								<Form.Label>Course Name</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter Course Name'
									name='coursename'
									onChange={(e) => setCourseName(e.target.value)}
								/>
							</Form.Group>

							<Form.Group className='mb-3'>
								<Form.Label>Section</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter Section'
									name='section'
									onChange={(e) => setSection(e.target.value)}
								/>
							</Form.Group>

							<Form.Label>Semester</Form.Label>
							<Form.Select
								className='mb-3'
								name='semester'
								onChange={(e) => setSemester(e.target.value)}
							>
								<option value=''>Select Semester</option>
								<option value='Sem 1'>Sem 1</option>
								<option value='Sem 2'>Sem 2</option>
								<option value='Sem 3'>Sem 3</option>
								<option value='Sem 4'>Sem 4</option>
								<option value='Sem 5'>Sem 5</option>
								<option value='Sem 6'>Sem 6</option>
							</Form.Select>

							<div className='text-center mb-3'>
								<Button variant='primary' className='px-5' type='submit'>
									Add Course
								</Button>
							</div>
						</Form>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default AddCourse;
