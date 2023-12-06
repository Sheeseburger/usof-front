import React from 'react';
import HeaderComponent from '../components/HeaderComponent';
import './../style/posts.css';
import './../style/create-post.css';
import './../style/header.css';
import SelectAllTransferList from '../components/categoryListComponent';

export default function CreatePost() {
	return (
		<div className="flex">
			<HeaderComponent />

			<SelectAllTransferList></SelectAllTransferList>
		</div>
	);
}
