import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_COURSE = gql`
	query course($id: ID!) {
		course(id: $id) {
			_id
			coursecode
			coursename
			section
			semester
		}
	}
`;

const UPDATE_COURSE = gql`
	mutation updateCourse(
		$id: ID!
		$coursecode: String!
		$coursename: String!
		$section: String!
		$semester: String!
	) {
		updateCourse(
			id: $id
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

const courseInitialValue = {
	coursecode: '',
	coursename: '',
	section: '',
	semester: '',
};

const UpdateCourse = () => {
	const { id } = useParams();
	const history = useHistory();
	const { loading, error, data } = useQuery(GET_COURSE, {
		variables: { id },
	});
	useEffect(() => {
		if (!id) {
			history.push('/');
		}
		if (data) {
			setCourse(data.course);
		}
	}, [data, history, id]);

	const [course, setCourse] = useState(courseInitialValue);

	const { coursecode, coursename, section, semester } = course;

	const onValueChange = (e) => {
		setCourse({ ...course, [e.target.name]: e.target.value });
	};

	const [updateCourse] = useMutation(UPDATE_COURSE);
	const handlesubmit = async (e) => {
		e.preventDefault();
		if (
			coursecode === '' ||
			coursename === '' ||
			section === '' ||
			semester === ''
		) {
			toast.error('Please Fill Course Details!!');
		} else {
			updateCourse({
				variables: {
					id: id,
					coursecode: coursecode,
					coursename: coursename,
					section: section,
					semester: semester,
				},
			});
			toast.success('Course Updated!!');
			history.push('/');
		}
	};

	if (loading)
		return (
			<Container className='my-3 py-3'>
				<p>Loading...</p>
			</Container>
		);

	if (error)
		return (
			<Container className='my-3 py-3'>
				<p>{`Error! ${error}`}</p>
			</Container>
		);
	return (
		<div>
			<Container className='my-3 py-3'>
				<Row>
					<Col md={{ span: 4, offset: 4 }} className='p-4 custom-shadow'  style={{background:"lightGrey"}}>
						<h4 className='text-center'>Update Course</h4>
						<Form className='my-3' onSubmit={handlesubmit} id='courseform'>
							<Form.Group className='mb-3'>
								<Form.Label>Course Code</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter Course Code'
									name='coursecode'
									value={coursecode}
									onChange={(e) => onValueChange(e)}
								/>
							</Form.Group>

							<Form.Group className='mb-3'>
								<Form.Label>Course Name</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter Course Name'
									name='coursename'
									value={coursename}
									onChange={(e) => onValueChange(e)}
								/>
							</Form.Group>

							<Form.Group className='mb-3'>
								<Form.Label>Section</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter Section'
									name='section'
									value={section}
									onChange={(e) => onValueChange(e)}
								/>
							</Form.Group>

							<Form.Label>Semester</Form.Label>
							<Form.Select
								className='mb-3'
								name='semester'
								onChange={(e) => onValueChange(e)}
							>
								<option value={semester}>{semester}</option>
								<option value='Sem 1'>Sem 1</option>
								<option value='Sem 2'>Sem 2</option>
								<option value='Sem 3'>Sem 3</option>
								<option value='Sem 4'>Sem 4</option>
								<option value='Sem 5'>Sem 5</option>
								<option value='Sem 6'>Sem 6</option>
							</Form.Select>

							<div className='text-center mb-3'>
								<Button variant='primary' className='px-5' type='submit'>
									Update Course
								</Button>
							</div>
						</Form>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default UpdateCourse;
