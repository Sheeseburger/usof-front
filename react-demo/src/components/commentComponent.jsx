import React, { useEffect, useState } from 'react';
import getCookies from '../cookieReader';
import { Avatar, Tooltip } from '@mui/material';
import './../style/comment.css';
import defaultPicture from '../static/koala.png';
// import EditIcon from '@mui/icons-material/Edit';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { useNavigate } from 'react-router';

let cookie = getCookies();
let user = {};
try {
	cookie = getCookies();
	user = JSON.parse(cookie['User']);
} catch (err) {}

const Comment = ({ comment, commentData, setCommentData }) => {
	const navigate = useNavigate();

	const [author, setAuthor] = useState({});
	const [isMyComment, setIsMyComment] = useState(false);
	const [isVisible, setIsVisible] = useState(comment.status === 'active');
	useEffect(() => {
		async function getAuthor() {
			try {
				if (comment) {
					console.log(comment);
					const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${comment.authorId}`, {
						headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie['jwt']}` },
					});
					if (response.ok) {
						const res = await response.json();
						if (res) {
							if (res.data.id === user.id || user.role === 'admin') setIsMyComment(true);
							setAuthor(res.data);
						} else {
						}
					}
				}
			} catch (error) {}
		}

		getAuthor();
	}, [comment]);
	const avatar = author.profilePicture ? `${process.env.REACT_APP_API_URL}/${author.profilePicture}` : defaultPicture;

	const dateString = comment.updatedAt;

	const date = new Date(dateString);
	async function deleteComment() {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/api/comments/${comment.id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie['jwt']}` },
		});
	}
	// async function editComment() {
	// 	setCommentData({ content: comment.content, buttonText: 'Edit', edit: true });
	// 	// const response = await fetch(`${process.env.REACT_APP_API_URL}/api/comments/${comment.id}`, {
	// 	// 	method: 'PATCH',
	// 	// 	headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie['jwt']}` },
	// 	// });
	// }
	return (
		<div className="comment">
			<div>
				<Avatar
					src={avatar}
					sx={{ width: 64, height: 64 }}
					className="user-Avatar"
					onClick={() => navigate(`../../profile/${author.id}`)}
				/>
				<span>{author.login}</span>
			</div>
			<div className="content"> {comment.content}</div>
			<div className="flex-end">
				<span>
					{' '}
					{date.toLocaleDateString()}: {date.toLocaleTimeString().slice(0, 5)}
					{isMyComment && (
						<div>
							{' '}
							{/* <VisibilityIcon onClick={editComment} /> */}
							<Tooltip title="Delete">
								<DeleteForeverIcon onClick={deleteComment} />
							</Tooltip>
						</div>
					)}
				</span>
			</div>
		</div>
	);
	// } catch (error) {
	// 	console.log(error);
	// 	return <div>Ops:3</div>;
	// }
};

export default Comment;
