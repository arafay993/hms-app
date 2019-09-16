import React from 'react';
import ReactDOM from 'react-dom';
// Routing
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
// The application, high order component
import App from './components/App';
// Application routes as external component
import Routes from './routes/Routes';
// Style
import './style/index.css';

// Browser history
const history = createBrowserHistory();


ReactDOM.render(
		<Router history={history}>
			<App>
				<Routes />
			</App>
		</Router>,
	document.getElementById('root')
);


// For Arch Linux (if ENOSPC error) add this line to /etc/sysctl.d/99-sysctl.conf
// fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -
