import { useEffect, useState } from 'react';
import '../style/header.css';
import '../style/profile.css';
import { Grid } from '@mui/material';
import getCookies from '../cookieReader';
import Post from './PostComponent';
import SettingsComponent from './SettingsComponent';
import { useParams } from 'react-router-dom';

let cookie;
let user = {};
try {
	cookie = getCookies();
	user = JSON.parse(cookie['User']);
} catch (err) {}
const ProfileComponent = () => {
	const { id } = useParams();
	const [favoritePosts, setFavoritePosts] = useState([]);
	const [userData, setUserData] = useState({});
	const [myPosts, setMyPosts] = useState([]);

	useEffect(() => {
		async function fetchMyPosts() {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts?authorId=${id || user.id}`);
				if (!response.ok) {
					throw new Error('Network response was not ok.');
				}
				const data = await response.json();
				setMyPosts(data.data);
			} catch (error) {
				setMyPosts([]);
			}
		}
		async function fetchUserData() {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${id || user.id}`);
				if (!response.ok) {
					throw new Error('Network response was not ok.');
				}
				const data = await response.json();
				setUserData(data.data);
			} catch (error) {
				setMyPosts([]);
			}
		}
		async function fetchFavPosts() {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/favorite`, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${cookie['jwt']}`,
					},
				});
				if (!response.ok) {
					throw new Error('Network response was not ok.');
				}
				const data = await response.json();
				setFavoritePosts(data.data);
			} catch (error) {
				console.error('There was a problem fetching the posts:', error);
				setFavoritePosts([]);
			}
		}
		const interval = setInterval(() => {
			fetchFavPosts();
			fetchMyPosts();
			fetchUserData();
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			<SettingsComponent userData={userData} />
			<Grid container>
				<Grid>
					<div className="list-header">
						<span className="list-header">{id ? 'post of ' + userData.login : 'my posts'}</span>
					</div>
					<div className="myPostList">
						{myPosts.map((post) => (
							<div className="postItem">
								<Post key={post.id} post={post} />
							</div>
						))}
					</div>
				</Grid>
				{!id && (
					<Grid>
						<div className="list-header">
							<span>Favorite</span>
						</div>
						<div className="myPostList">
							{favoritePosts &&
								favoritePosts.map((post) => (
									<div className="postItem">
										<Post key={post.id} post={post} />
									</div>
								))}
						</div>
					</Grid>
				)}
			</Grid>
		</div>
	);
};

export default ProfileComponent;
