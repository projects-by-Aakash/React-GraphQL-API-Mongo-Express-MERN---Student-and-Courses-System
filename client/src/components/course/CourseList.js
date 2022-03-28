import React, { useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { gql, useQuery, useMutation } from '@apollo/client';

// delete course schema define
const DELETE_COURSE = gql`
	mutation deleteCourse($id: ID!) {
		deleteCourse(id: $id) {
			_id
			coursecode
			coursename
			section
			semester
		}
	}
`;

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

const CourseList = () => {
	let { loading, error, data, refetch } = useQuery(GET_COURSES);
	useEffect(() => {
		refetch();
	});

	let [deleteCourse] = useMutation(DELETE_COURSE);

	const handleDelete = async (courseId) => {
		const id = courseId;
		const deleteData = deleteCourse({ variables: { id: id } });
		if (deleteData) {
			toast.error('Delete Course!!');
			refetch();
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
		<Container className='my-3 py-3'>
			<h4 className='text-center'>Course List</h4>
			<Table responsive='sm' bordered  style={{background:"lightGrey"}}>
				<thead className='bg-dark text-white'>
					<tr>
						<th>Course Code</th>
						<th>Course Name</th>
						<th>Section</th>
						<th>Semester</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{data.courses.map((course, index) => (
						<tr key={index}>
							<td>{course.coursecode}</td>
							<td>{course.coursename}</td>
							<td>{course.section}</td>
							<td>{course.semester}</td>
							<td>
								<Link to={`/updatecourse/${course._id}`} className='mx-2'>
									<box-icon type='solid' name='edit'></box-icon>
								</Link>
								<box-icon
									className='delete-button'
									type='solid'
									name='trash'
									onClick={() => handleDelete(course._id)}
								></box-icon>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</Container>
	);
};

export default CourseList;
