import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/PostComponent';
import Comment from '../components/commentComponent';
import getCookies from '../cookieReader';
import '../style/comment.css';

import HeaderComponent from '../components/HeaderComponent';
import TextField from '@mui/material/TextField';
const cookie = getCookies();

const SinglePostPage = () => {
	const { postId } = useParams();
	const [post, setPost] = useState();
	const [comments, setComments] = useState();
	const [commentData, setCommentData] = useState({
		content: '',
	});
	useEffect(() => {
		async function fetchPost() {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, {
					headers: {
						// 'Content-Type': 'application/json',
						Authorization: `Bearer ${cookie['jwt']}`,
					},
				});
				if (!response.ok) {
					throw new Error('Network response was not ok.');
				}
				const data = await response.json();
				setPost(data.data);
			} catch (error) {
				console.error('There was a problem fetching the post:', error);
				setPost(null);
			}
		}

		async function fetchComments() {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${cookie['jwt']}`,
					},
				});
				if (!response.ok) {
					setComments(null);
					throw new Error('Network response was not ok.');
				} else {
					const data = await response.json();
					setComments(data.data);
				}
			} catch (error) {
				console.error('There was a problem fetching the post:', error);
				setComments(null);
			}
		}
		const interval = setInterval(() => {
			fetchPost();
			fetchComments();
		}, 250);

		return () => {
			clearInterval(interval);
		};
	});
	if (!post) {
		return <div>Loading...</div>;
	}

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setCommentData({
			...commentData,
			[name]: value,
		});
	};

	async function writeComment() {
		let method = 'POST';
		if (commentData.edit) {
			method = 'PATCH';
		}
		const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`, {
			method,
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie['jwt']}` },
			body: JSON.stringify(commentData),
		});
		if (response.ok) {
			// console.log('opa');
			setCommentData({ content: '' });
			// clear content input
		}
	}
	return (
		<div className="single-post">
			<HeaderComponent />
			<Post key={post.id} post={post} detail={true} />
			<h2>Comments</h2>
			<div className="write-comment">
				<div className="comment-text">
					<TextField
						id="outlined-multiline-flexible"
						label="Know something?"
						multiline
						maxRows={20}
						fullWidth={1}
						name="content"
						value={commentData.content}
						onChange={handleInputChange}
					/>
				</div>
				<button className="button-30 submit-comment" onClick={writeComment}>
					{commentData.edit ? 'Edit' : 'Write'}
				</button>
			</div>
			<div className="comments-list">
				{comments &&
					comments.length > 0 &&
					comments.map((comment) => (
						<Comment
							key={comment.id}
							comment={comment}
							setCommentData={setCommentData}
							commentData={commentData}
						/>
					))}
			</div>
		</div>
	);
};

export default SinglePostPage;
