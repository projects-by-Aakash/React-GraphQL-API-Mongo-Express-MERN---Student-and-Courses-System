import React, { useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { Authentication } from '../../auth/authentication';
import { gql, useQuery } from '@apollo/client';

// selected course schema declare
const GET_SELECTED_COURSES = gql`
	{
		selectedCourses {
			_id
			coursecode
			coursename
			section
			semester
		}
	}
`;

const CourseSelected = () => {
	let { loading, error, data, refetch } = useQuery(GET_SELECTED_COURSES);
	const history = useHistory();
	useEffect(() => {
		if (!Authentication.getToken()) {
			history.push('/login');
			toast.success('Login First');
		}
		refetch();
	});
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
			<h4 className='text-center'>Course Taken By Student</h4>
			<Table responsive='sm' bordered  style={{background:"lightGrey"}}>
				<thead className='bg-dark text-white'>
					<tr>
						<th>Course Code</th>
						<th>Course Name</th>
						<th>Section</th>
						<th>Semester</th>
					</tr>
				</thead>
				<tbody>
					{data.selectedCourses.length > 0 ? (
						data.selectedCourses.map((data) => (
							<tr key={data._id}>
								<td>{data.coursecode}</td>
								<td>{data.coursename}</td>
								<td>{data.section}</td>
								<td>{data.semester}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={4} className='text-center'>
								No Any Course You Have Selected
							</td>
						</tr>
					)}
				</tbody>
			</Table>
		</Container>
	);
};

export default CourseSelected;
