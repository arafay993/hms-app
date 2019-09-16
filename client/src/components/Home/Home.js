import React from 'react';
import logo from '../../logo.svg';
class HomePage extends React.Component {
	render() {
		return (
			<div>
				<div className="ui container text">
					<h1 className="ui header">Welcome To Hotel Management System!</h1>

					<b>Basically</b>
					<p>It's a simple project made with React, NodeJS (Express), Sequelize ORM and PostgreSQL</p>

					<img className="logo App-logo" src={logo} alt="Logo" />
				</div>

				<br />
				<br />
				<br />

			</div>
		);
	}
}

export default HomePage;
