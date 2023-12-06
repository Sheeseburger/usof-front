import React from 'react';
import HeaderComponent from '../components/HeaderComponent';
import './../style/posts.css';
import './../style/header.css';
import ProfileComponent from '../components/ProfileComponent';

export default function ProfilePage() {
	return (
		<div className="flex">
			<HeaderComponent dontShowLogout />
			<ProfileComponent></ProfileComponent>
		</div>
	);
}
