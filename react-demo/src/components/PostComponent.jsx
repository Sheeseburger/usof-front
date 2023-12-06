import React, { useEffect, useState } from 'react';
// import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router';

import getCookies from '../cookieReader';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import likeInactive from '../static/like_inactive.svg';
import likeActive from '../static/like_active.svg';
import dislikeActive from '../static/dislike_active.svg';
import dislikeInactive from '../static/dislike_inactive.svg';
import defaultAvathar from '../static/koala.png';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Avatar, Paper, Tooltip } from '@mui/material';
let cookie;
let user = {};
try {
	cookie = getCookies();
	user = JSON.parse(cookie['User']);
} catch (err) {}

const Post = ({ post, detail = false }) => {
	const [likeState, setLikeState] = useState((post.Likes || []).filter((el) => el.type === 'like'));
	const [dislikeState, setDislikeState] = useState((post.Likes || []).filter((el) => el.type === 'dislike'));
	const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);
	const [userAvathar, setUserAvathar] = useState(defaultAvathar);
	const [isInactive, setIsInactive] = useState(post.status !== 'active');
	// console.log(isInactive);
	useEffect(() => {
		async function isInFav() {
			try {
				if (post.authorId !== user.id && user.id) {
					const response = await fetch(`${process.env.REACT_APP_API_URL}/api/favorite/${post.id}`, {
						headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie['jwt']}` },
					});
					if (response.ok) {
						const res = await response.json();
						if (res) {
							// console.log(res);
							setIsAddedToFavorites(true);
						} else {
							setIsAddedToFavorites(false);
						}
					}
				}
			} catch (error) {}
		}
		async function getProfilePic() {
			try {
				if (post.authorId) {
					const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${post.authorId}`, {
						headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie['jwt']}` },
					});

					if (response.ok) {
						const res = await response.json();
						// console.log('sxua?');
						setUserAvathar(`${process.env.REACT_APP_API_URL}/${res.data.profilePicture}`);
						// setIsAddedToFavorites(true);
					}
				}
			} catch (error) {}
		}
		// function inActive() {
		// 	if (post.status === 'active' && post.authorId === user.id) setIsInactive(false);
		// 	else if (post.status !== 'active' && post.authorId === user.id) setIsInactive(true);
		// }
		isInFav();
		getProfilePic();
		// inActive();
	}, [post]);

	const emotionsFiller = async (postId) => {
		const newLikes = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/likes`);
		if (!newLikes.ok) return;
		const newLikesJson = await newLikes.json();
		setLikeState(newLikesJson.data.filter((el) => el.type === 'like'));
		setDislikeState(newLikesJson.data.filter((el) => el.type === 'dislike'));
	};

	const likeHandler = async (type, postId) => {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/likes`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie['jwt']}` },
			body: JSON.stringify({ type }),
		});
		if (!response.ok) {
			const removeLike = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/likes`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie['jwt']}` },
			});
			if (!removeLike.ok) {
				return;
			}
		}
		emotionsFiller(postId);
	};
	const addToFavorite = async (postId) => {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/api/favorite/${postId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie['jwt']}` },
		});
		if (response.ok) {
			if (response.status === 220) {
				// console.log('nononon');
				const responseDel = await fetch(`${process.env.REACT_APP_API_URL}/api/favorite/${postId}`, {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie['jwt']}` },
				});
				// console.log('tryuing to deleet');
				// console.log(responseDel.ok);
				if (responseDel.ok) setIsAddedToFavorites(false);
			} else {
				console.log('added');
				setIsAddedToFavorites(true);
			}
		}
	};
	const navigate = useNavigate();
	const dateString = post.updatedAt;

	const date = new Date(dateString);

	async function makeInactive(postId) {
		let status = 'active';
		if (!isInactive) {
			status = 'inactive';
		}
		console.log(status);
		const responseDel = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie['jwt']}` },
			body: JSON.stringify({ status }),
		});
		if (responseDel.ok) {
			const res = await responseDel.json();
			console.log(res);
			console.log('lap');
			if (status === 'active') {
				setIsInactive(false);
			} else setIsInactive(true);
		}
	}

	return (
		<Paper elevation={20} className={post.status}>
			<div className="post">
				<div className="titleDivPost">
					<span className="titlePost">{post.title}</span>
					<span className="datePost">
						{user && user.id === post.authorId && (
							<div onClick={() => navigate('/create-post/' + post.id)}>
								<Tooltip title="Edit">
									<ModeEditIcon />
								</Tooltip>
							</div>
						)}
						{user && user.id === post.authorId && (
							<div onClick={() => makeInactive(post.id)}>
								{isInactive ? (
									<Tooltip title="Make active">
										<VisibilityIcon />
									</Tooltip>
								) : (
									<Tooltip title="Make inactive">
										<VisibilityOffIcon />
									</Tooltip>
								)}
							</div>
						)}
						{user && user.id !== post.authorId && (
							<div onClick={() => addToFavorite(post.id)}>
								{isAddedToFavorites ? (
									<Tooltip title="Remove from favorite">
										<BookmarkIcon />
									</Tooltip>
								) : (
									<Tooltip title="Add to favorite">
										<BookmarkBorderIcon />
									</Tooltip>
								)}
							</div>
						)}
						{date.toLocaleDateString()}: {date.toLocaleTimeString().slice(0, 5)}
					</span>
				</div>

				<div className="userPost">
					<Avatar
						className="avatarPost header-avatar"
						src={userAvathar}
						sx={{ width: 100, height: 100 }}
						onClick={() => navigate('/profile/' + post.authorId)}
					></Avatar>
					<span className="authorPost">{post.login}</span>
				</div>

				<div className="likeCategoryPost">
					{post.Categories && post.Categories.length > 0 && (
						<div className="CategoryContentPost">
							<p>Categories:</p>
							<div className="categoryContainer">
								{post.Categories.map((category) => (
									<button className="categoryItem">
										<a href={'/?category=' + category.id} className="categoryLink">
											{category.title}
										</a>
									</button>
								))}
							</div>
						</div>
					)}
					<div className="emotionDiv">
						<div className="like" onClick={() => likeHandler('like', post.id)}>
							<img
								src={likeState.some((like) => like.authorId === user.id) ? likeActive : likeInactive}
								alt=""
								className="emotion"
							/>
						</div>

						<div className="dislike " onClick={() => likeHandler('dislike', post.id)}>
							<img
								src={
									dislikeState.some((dislike) => dislike.authorId === user.id)
										? dislikeActive
										: dislikeInactive
								}
								alt=""
								className="emotion"
							/>
						</div>
						<div>
							<span className="emotionCount">{likeState.length}</span>
						</div>
						<div>
							<span className="emotionCount">{dislikeState.length}</span>
						</div>
					</div>
				</div>
				<div
					className="contentPost"
					onClick={() => {
						navigate(`/posts/${post.id}`);
					}}
				>
					<span className="content-span">
						{detail
							? post.content
							: post.content.length > 150
							? post.content.slice(0, 150) + '...'
							: post.content}
					</span>
				</div>

				{/* </div> */}
			</div>
		</Paper>
	);
};

export default Post;
