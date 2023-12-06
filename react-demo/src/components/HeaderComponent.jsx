import React from 'react';
// import Container from 'react-bootstrap/Container';
// import Navbar from 'react-bootstrap/Navbar';
import cookieReader from '../cookieReader';
// import { useNavigate, useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import defaultAvatar from './../static/koala.png';
import '../style/header.css';
import { Avatar } from '@mui/material';

const HeaderComponent = ({ onSearch, dontShowLogout }) => {
	const navigate = useNavigate();
	function onLogout() {
		// console.log('hello');
		document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		document.cookie = 'User=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		document.cookie = 'Session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		window.location.reload();

		navigate('/');
	}
	function toHome() {
		navigate('/');
	}
	function createPost() {
		navigate('/create-post');
	}
	function login() {
		navigate('/login');
	}
	let user;
	let avatar = defaultAvatar;
	// const logo = `${process.env.REACT_APP_API_URL}/public/logo.jpg`;
	try {
		user = JSON.parse(cookieReader()['User']);
		if (user && user.profilePicture) avatar = `${process.env.REACT_APP_API_URL}/${user.profilePicture}`;
	} catch (error) {}
	return (
		<>
			<header className="header">
				<div className="serviceName header__item button-30" onClick={toHome}>
					<span>THL</span>
				</div>
				<div className="header__item button-30 " onClick={createPost}>
					<span>Add</span>
				</div>
				<div className="header__item button-30 " onClick={() => navigate('/tags')}>
					<span>New Tags</span>
				</div>
				<div className="header__item user-info right-align">
					{user ? (
						<>
							{' '}
							<span className="login">{user.login}</span>
							<Avatar
								alt="Avathar"
								className="header-avatar"
								src={avatar}
								sx={{ width: 86, height: 86 }}
								onClick={() => navigate('/profile')}
							></Avatar>
							{/* <img  alt="User Avatar" className="avatar info__item" /> */}
							{dontShowLogout && (
								<span className="info__item button-30 logout" onClick={onLogout}>
									Logout
								</span>
							)}
						</>
					) : (
						<div className=" button-30" onClick={login}>
							<span>Log in</span>
						</div>
					)}
				</div>
				{/* Add Menu items or component here */}
				{/* <Menu /> */}
			</header>
		</>
	);
};

export default HeaderComponent;
