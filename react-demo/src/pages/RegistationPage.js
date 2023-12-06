import React from 'react';
import RegistrationForm from '../components/RegistrationForm';
import HeaderComponent from '../components/HeaderComponent';
const RegistrationPage = () => {
	return (
		<div>
			<HeaderComponent />
			<h1>Registration</h1>
			<RegistrationForm />
		</div>
	);
};

export default RegistrationPage;
