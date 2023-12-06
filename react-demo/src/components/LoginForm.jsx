import React, { useState } from 'react';

import { useNavigate, useLocation } from 'react-router';
const LoginForm = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [formData, setFormData] = useState({
		login: '',
		password: '',
		confirmPassword: '',
	});

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			return;
		}
		if (formData.login.indexOf('@') !== -1) {
			formData.email = formData.login;
			formData.login = '';
		}
		const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData),
		});
		if (response.ok) {
			const res = await response.json();
			const expirationTime = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
			document.cookie = `jwt=${res.token}; expires=${expirationTime.toUTCString()}; path=/`;
			document.cookie = `User=${JSON.stringify(res.data.user)}; expires=Thu, 31 Dec 2023 12:00:00 UTC; path=/`;
			if (location.state?.from) {
				navigate(location.state.from);
			}
			navigate('/');
		} else {
			const errorData = await response.json();
			console.error('Server error:', errorData);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				name="login"
				value={formData.login}
				onChange={handleInputChange}
				placeholder="login or email"
			/>
			<input
				type="password"
				name="password"
				value={formData.password}
				onChange={handleInputChange}
				placeholder="password"
			/>
			<input
				type="password"
				name="confirmPassword"
				value={formData.confirmPassword}
				onChange={handleInputChange}
				placeholder="Confirm password"
			/>
			<button type="submit">Log in</button>
		</form>
	);
};

export default LoginForm;
