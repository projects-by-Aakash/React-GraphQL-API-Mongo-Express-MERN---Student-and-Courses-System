import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/navbar/Header';
import StudentList from './components/student/StudentList';
import Login from './components/login/Login';
import Home from './components/Home';
import AddCourse from './components/course/AddCourse';
import CourseList from './components/course/CourseList';
import UpdateCourse from './components/course/UpdateCourse';
import CourseSelected from './components/course/CourseSelected';
import ChooseCourse from './components/course/ChooseCourse';

function App() {
	return (
		<BrowserRouter>
			<Header />
			<Switch>
				<Route path='/' exact component={Home}></Route>
				<Route path='/courseList' exact component={CourseList}></Route>
				<Route path='/login' exact component={Login}></Route>
				<Route path='/addcourse' exact component={AddCourse}></Route>
				<Route path='/updatecourse/:id' exact component={UpdateCourse}></Route>
				<Route path='/courses' exact component={CourseSelected}></Route>
				<Route path='/choosecourse' exact component={ChooseCourse}></Route>
				<Route path='/studentlist' exact component={StudentList}></Route>
				<Route path='/studentdetail' exact component={UpdateCourse}></Route>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
