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
// function Copyright(props) {
// 	return (
// 		<Typography variant="body2" color="text.secondary" align="center" {...props}>
// 			{'Copyright © '}
// 			<Link color="inherit" href="https://mui.com/">
// 				Your Website
// 			</Link>{' '}
// 			{new Date().getFullYear()}
// 			{'.'}
// 		</Typography>
// 	);
// }

export default function SignIn() {
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();
	const location = useLocation();
	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const bodyData = {
			email: formData.get('email'),
			password: formData.get('password'),
		};
		const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
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
			document.cookie = `User=${JSON.stringify(res.data.user)}; expires=${expirationTime.toUTCString()}; path=/`;
			if (location.state?.from) {
				navigate(location.state.from);
			}
			navigate('/');
		} else {
			const errorData = await response.json();
			console.error('Server error:', errorData);
			setErrorMessage('There was an error. Please try again.' + errorData.message);
		}
	};

	const defaultTheme = createTheme();

	return (
		<div className="container-form">
			<div className="background-main">
				<Container component="main" maxWidth="xs">
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
							Sign in
						</Typography>
						{errorMessage && (
							<Typography variant="body1" color="error" align="center">
								{errorMessage}
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
							<TextField
								margin="normal"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
							/>

							<button type="submit" className="button-30 fullWidth" variant="contained">
								Sign In
							</button>
							<Grid container>
								<Grid item xs>
									<Link href="forgotPassword" className="link-refactor" variant="body2">
										Forgot password?
									</Link>
								</Grid>
								<Grid item>
									<Link href="/register" className="link-refactor" variant="body2">
										{"Don't have an account? Sign Up"}
									</Link>
								</Grid>
							</Grid>
						</Box>
					</Box>
					{/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
				</Container>
			</div>
		</div>
	);
}
