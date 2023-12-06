import React, { useState } from 'react';
const RegistrationForm = () => {
	const [formData, setFormData] = useState({
		login: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const reg_url = `${process.env.REACT_APP_API_URL}/api/auth/register`;
		console.log(reg_url);
		const response = await fetch(reg_url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData),
		});
		if (response.ok) {
		} else {
			const errorData = await response.json();
			console.error('Server error:', errorData);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input type="text" name="login" value={formData.login} onChange={handleInputChange} placeholder="Логін" />
			<input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
			<input
				type="password"
				name="password"
				value={formData.password}
				onChange={handleInputChange}
				placeholder="Пароль"
			/>
			<input
				type="password"
				name="confirmPassword"
				value={formData.confirmPassword}
				onChange={handleInputChange}
				placeholder="Підтвердіть пароль"
			/>
			<button type="submit">Зареєструватися</button>
		</form>
	);
};

export default RegistrationForm;
