import React, { useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';

// student schema declare
const GET_STUDENTS = gql`
	{
		students {
			_id
			studentnumber
			firstname
			lastname
			email
			phone
			password
			city
			address
			program
		}
	}
`;

const StudentList = () => {
	const { loading, error, data, refetch } = useQuery(GET_STUDENTS);

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (loading)
		return (
			<Container className='my-3 py-3'>
				<p>Loading...</p>
			</Container>
		);
	if (error)
		return (
			<Container className='my-3 py-3'>
				<p>Error- Something went wrong</p>
			</Container>
		);

	return (
		<Container className='my-3 py-3'>
			<h4 className='text-center mb-4'>List of all Students</h4>
			<Table responsive='sm' bordered  style={{background:"LightGrey"}}>
				<thead className='text-center'>
					<tr>
						<th>Student Number</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Email</th>
						<th>Phone</th>
						<th>Address</th>
						<th>City</th>
						<th>Program</th>
					</tr>
				</thead>
				<tbody className='text-center'>
					{data.students.map((student, index) => (
						<tr key={index}>
							<td>{student.studentnumber}</td>
							<td>{student.firstname}</td>
							<td>{student.lastname}</td>
							<td>{student.email}</td>
							<td>{student.phone}</td>
							<td>{student.address}</td>
							<td>{student.city}</td>
							<td>{student.program}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</Container>
	);
};

export default StudentList;
