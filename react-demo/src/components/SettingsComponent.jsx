import defaultAvatar from './../static/koala.png';
import { Avatar, Button, Grid, TextField } from '@mui/material';
import getCookies from '../cookieReader';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
let cookie;
let user = {};
try {
	cookie = getCookies();
	user = JSON.parse(cookie['User']);
} catch (err) {}
export default function SettingsComponent({ userData }) {
	const { id } = useParams();
	console.log(id);
	const fileInputRef = useRef(null);
	const [showUpdateFields, setShowUpdateFields] = useState(false);
	const userAvathar = userData.profilePicture
		? `${process.env.REACT_APP_API_URL}/${userData.profilePicture}`
		: defaultAvatar;
	const [userDyn, setUserDyn] = useState({});

	useEffect(() => {
		async function fetchUserData() {
			try {
				console.log(user.id);
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${id || user.id}`, {
					headers: {
						Authorization: `Bearer ${cookie['jwt']}`,
					},
				});

				if (response.ok) {
					const userData = await response.json();
					console.log(userData.data);
					setUserDyn(userData.data);
				} else {
					console.error('Failed to fetch user data');
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		}

		fetchUserData();
	}, [id]);
	const handleShowFields = () => {
		showUpdateFields ? setShowUpdateFields(false) : setShowUpdateFields(true);
	};

	const handleAvatarChange = async (e) => {
		const selectedFile = e.target.files[0];

		const formData = new FormData();
		formData.append('avatar', selectedFile);

		try {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/avatar`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${cookie['jwt']}`,
				},
				body: formData,
			});

			if (response.ok) {
				const res = await response.json();
				document.cookie = `User=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
				console.log(res);
				const expirationTime = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
				document.cookie = `User=${JSON.stringify(res.data)}; expires=${expirationTime.toUTCString()}; path=/`;
				fileInputRef.current.value = '';
				window.location.reload();
			} else {
				console.error('Failed to upload avatar');
			}
		} catch (error) {
			console.error('Error uploading avatar:', error);
		}
	};
	const [formData, setFormData] = useState({
		email: userDyn.email,
		login: userDyn.login,
	});
	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async () => {
		if (formData.email === userDyn.email && formData.login === userDyn.login) {
			return;
		}
		const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userDyn.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookie['jwt']}`,
			},
			body: JSON.stringify(formData),
		});
		if (response.ok) {
			const res = await response.json();
			console.log(res);
			document.cookie = `User=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

			console.log(res);
			const expirationTime = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
			document.cookie = `User=${JSON.stringify(res.data)}; expires=${expirationTime.toUTCString()}; path=/`;
			window.location.reload();
		}
	};

	return (
		<div className="container">
			<div className="avatar-container">
				<div className="profile-hat">
					<Grid container direction="column">
						<Grid>
							<Avatar
								src={userAvathar}
								alt="Avatar"
								className="profile-avatar"
								alignItems="center"
								sx={{ width: 256, height: 256 }}
							/>
						</Grid>

						{!id ? (
							<Grid>
								<Button sx={{ width: 0.8 }} component="label" variant="contained">
									Upload file
									<input
										type="file"
										className="file-chooser"
										onChange={handleAvatarChange}
										accept="image/*"
										ref={fileInputRef}
									/>
								</Button>
							</Grid>
						) : (
							<Grid>
								<span>{}</span>
							</Grid>
						)}
					</Grid>
					{!id && (
						<div className="edit-profile">
							{showUpdateFields && (
								<div className="grid-fields">
									<div className="grid-fields-item">
										<TextField
											onChange={handleInputChange}
											required
											id="outlined-required"
											label="Required"
											defaultValue={userDyn.email}
											name="email"
										/>
									</div>
									<div className="grid-fields-item">
										{' '}
										<TextField
											onChange={handleInputChange}
											required
											id="outlined-required"
											label="Required"
											defaultValue={userDyn.login}
											name="login"
										/>
									</div>
									<button onClick={handleSubmit} className="grid-fields-item button-30">
										Submit
									</button>
								</div>
							)}
							<button onClick={handleShowFields} className="button-30 toButtom">
								Update Profile
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
