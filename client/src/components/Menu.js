import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.svg';

class Menu extends React.Component {
	render() {
		return (
			<div className="ui fixed inverted menu">
				<NavLink className="header item" activeonlywhenexact="active" exact to="/">
					<img className="logo App-logo" src={logo} alt="Logo" />
					The Application
				</NavLink>

				<NavLink className="item" activeonlywhenexact="active" exact to="/recipies">
					Hotel Management System
				</NavLink>
			</div>
		);
	}
}

export default Menu;
