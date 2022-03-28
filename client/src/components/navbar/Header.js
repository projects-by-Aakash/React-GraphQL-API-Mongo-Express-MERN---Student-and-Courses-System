import React from 'react';
import { useHistory } from 'react-router-dom';
import { Authentication } from '../../auth/authentication';
import {AppBar, Toolbar, makeStyles} from "@material-ui/core";
import { NavLink } from 'react-router-dom';

const useStyle = makeStyles({
    header:{
        background: '#111111'
    },
    tabs:{
        color:"#ffffff",
        textDecoration:"none",
        marginRight: 20,
        fontSize:15
    }
});

const Header = () => {
	const classes = useStyle();
	const history = useHistory();
	const logoutHandler = () => {
		Authentication.removeToken();
		history.push('/login');
	};
	return (
		<AppBar className={classes.header} position="static">
            <Toolbar>
                <NavLink className={classes.tabs} to="./">Home</NavLink>
                <NavLink className={classes.tabs} to="courseList">Course List</NavLink>
                <NavLink className={classes.tabs} to="addcourse">Add Course</NavLink>
                <NavLink className={classes.tabs} to="courses">Courses</NavLink>
                <NavLink className={classes.tabs} to="choosecourse">Choose Course</NavLink>
                <NavLink className={classes.tabs} to="studentlist">Student List</NavLink>
                <NavLink className={classes.tabs} to="login">Login</NavLink>
                <p
							onClick={logoutHandler}
							className={classes.tabs}
							style={{marginTop:"15px"}}
						>
							Logout
						</p>
            </Toolbar>
        </AppBar>
	);
};

export default Header;
