// import * as React from 'react';

import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useNavigate, useLocation } from 'react-router';
function Copyright(props) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{'Copyright © '}
			<Link color="inherit" href="https://mui.com/">
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
	const [errorMessage, setErrorMessage] = useState('');

	const navigate = useNavigate();
	const location = useLocation();
	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const bodyData = {
			email: formData.get('email'),
			login: formData.get('login'),
			password: formData.get('password'),
			verifyPassword: formData.get('passwordConfirm'),
			fullName: formData.get('fullName'),
		};
		if (
			bodyData.email &&
			bodyData.login &&
			bodyData.password &&
			bodyData.password === bodyData.verifyPassword &&
			bodyData.fullName
		) {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(bodyData),
			});
			if (response.ok) {
				const res = await response.json();
				document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
				document.cookie = 'User=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
				const expirationTime = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
				document.cookie = `jwt=${res.token}; expires=${expirationTime.toUTCString()}; path=/`;
				document.cookie = `User=${JSON.stringify(
					res.data.user
				)}; expires=Thu, 31 Dec 2023 12:00:00 UTC; path=/`;
				if (location.state?.from) {
					navigate(location.state.from);
				}
				navigate('/');
			} else if (!response.ok) {
				const errorData = await response.json();
				console.error('Server error:', errorData);
				setErrorMessage('There was an error. Please try again.' + errorData.message);
			}
		} else {
			setErrorMessage('All fields a required.');
		}
	};

	return (
		<div className="container-form">
			<div className="background-main">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					{errorMessage && (
						<Typography variant="body1" color="error" align="center">
							{errorMessage}
						</Typography>
					)}
					<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="given-name"
									name="login"
									required
									fullWidth
									id="login"
									label="Login"
									autoFocus
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="fullName"
									label="Name"
									name="fullName"
									autoComplete="family-name"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="new-password"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="passwordConfirm"
									label="Confirm Password"
									type="password"
									id="passwordConfirm"
									autoComplete="new-password"
								/>
							</Grid>
						</Grid>
						<button
							type="submit"
							className=" button-30 fullWidth reg-button"
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign Up
						</button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link href="/login" className="link-refactor" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</div>
		</div>
	);
}
