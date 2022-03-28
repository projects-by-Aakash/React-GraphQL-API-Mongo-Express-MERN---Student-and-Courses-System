import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Authentication } from '../../auth/authentication';

// course schema declare
const GET_COURSES = gql`
	{
		courses {
			_id
			coursecode
			coursename
			section
			semester
		}
	}
`;

const CHOOSE_COURSE = gql`
	mutation chooseCourse($id: ID!) {
		chooseCourse(id: $id) {
			message
		}
	}
`;

const ChooseCourse = () => {
	let { loading, error, data, refetch } = useQuery(GET_COURSES);
	useEffect(() => {
		if (!Authentication.getToken()) {
			history.push('/login');
			toast.success('Login First');
		}
		refetch();
	});
	const history = useHistory();
	const [courseChoose, setchooseCourse] = useState('');

	const clearState = () => {
		setchooseCourse('');
	};
	const [chooseCourse] = useMutation(CHOOSE_COURSE);
	const handlesubmit = async (e) => {
		e.preventDefault();

		if (courseChoose === '') {
			toast.error('Please Choose the Course!!');
		} else {
			chooseCourse({ variables: { id: courseChoose } })
				.then((data) => {
					if (data) {
						toast.success('Course Selected Successfully!!!');
					}
				})
				.catch((error) => {
					toast.error('Something Wrong Try Again!!!');
				});
			clearState();
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
				<p>Error- Something went Wrong</p>
			</Container>
		);

	return (
		<div>
			<Container className='my-3 py-3'>
				<Row>
					<Col md={{ span: 4, offset: 4 }} className='p-4 custom-shadow'  style={{background:"lightGrey"}}>
						<h4 className='text-center'>Choose Course</h4>
						<Form className='my-3' onSubmit={handlesubmit} id='courseform'>
							<Form.Label>Semester</Form.Label>
							<Form.Select
								className='mb-3'
								name='semester'
								onChange={(e) => setchooseCourse(e.target.value)}
							>
								<option value=''>Select Course</option>
								{data.courses.map((course) => (
									<option key={course._id} value={course._id}>
										{course.coursename}
									</option>
								))}
							</Form.Select>

							<div className='text-center mb-3'>
								<Button variant='primary' className='px-5' type='submit'>
									Select Course
								</Button>
							</div>
						</Form>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default ChooseCourse;
