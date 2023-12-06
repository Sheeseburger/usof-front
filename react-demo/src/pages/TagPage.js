import React, { useState } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import './../style/posts.css';
import './../style/header.css';
import getCookies from '../cookieReader';
import { TextField } from '@mui/material';
import CreateTagFieldComponent from '../components/CreateTagFieldsComponent';
let cookie;
let user = {};
try {
	cookie = getCookies();
	user = JSON.parse(cookie['User']);
} catch (err) {}

export default function TagPage() {
	return <CreateTagFieldComponent></CreateTagFieldComponent>;
}
