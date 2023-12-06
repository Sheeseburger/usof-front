import React from 'react';
import LoginForm from '../components/LoginForm';

import HeaderComponent from '../components/HeaderComponent';
const RegistrationPage = () => {
	return (
		<div>
			<HeaderComponent />
			<a href="/">Home</a>
			<h1>Login</h1>
			<LoginForm />
		</div>
	);
};

export default RegistrationPage;
