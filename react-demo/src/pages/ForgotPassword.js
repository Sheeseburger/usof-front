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
import { useParams } from 'react-router-dom';

export default function ForgotPassword() {
	const { token } = useParams();
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const navigate = useNavigate();
	const location = useLocation();

	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const bodyData = {
			email: formData.get('email'),
		};

		if (bodyData.email) {
			let resetURL = `${process.env.REACT_APP_API_URL}/api/auth/password-reset`;
			if (token) {
				resetURL += `/${token}`;
				bodyData.password = formData.get('password');
			}
			const response = await fetch(resetURL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(bodyData),
			});
			if (response.ok && !token) {
				setErrorMessage('');
				setSuccessMessage('Email send to email. Use link in email.');
				if (location.state?.from) {
					navigate(location.state.from);
				}
				// navigate('/');
			} else if (response.ok && token) {
				const res = await response.json();
				const expirationTime = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
				document.cookie = `jwt=${res.token}; expires=${expirationTime.toUTCString()}; path=/`;
				document.cookie = `User=${JSON.stringify(
					res.data.user
				)}; expires=Thu, 31 Dec 2023 12:00:00 UTC; path=/`;
				if (location.state?.from) {
					navigate(location.state.from);
				}
				navigate('/');
			} else {
				const errorData = await response.json();
				console.error('Server error:', errorData);
				setErrorMessage('There was an error. Please try again.' + errorData.message);
			}
		}
	};

	const defaultTheme = createTheme();

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
						Forgot Password?
					</Typography>
					{errorMessage && (
						<Typography variant="body1" color="error" align="center">
							{errorMessage}
						</Typography>
					)}
					{successMessage && (
						<Typography variant="body1" color="success" align="center">
							{successMessage}
						</Typography>
					)}
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						{token && (
							<TextField
								margin="normal"
								required
								fullWidth
								id="password"
								label="password"
								type="password"
								name="password"
								autoComplete="current-password"
								autoFocus
							/>
						)}
						<button type="submit" className="fullWidth button-30" variant="contained" sx={{ mt: 3, mb: 2 }}>
							Reset password
						</button>
						<Grid container>
							<Grid item>
								<Link href="/register" className="link-refactor" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</div>
		</div>
	);
}
