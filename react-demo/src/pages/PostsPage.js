import React, { useState, useEffect } from 'react';
import Post from '../components/PostComponent';
import HeaderComponent from '../components/HeaderComponent';
import './../style/posts.css';
import getCookies from '../cookieReader';
import { useParams, useSearchParams } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import FilterListComponent from './../components/FilterListComponent';
let cookie = getCookies();
let user = {};
try {
	cookie = getCookies();
	user = JSON.parse(cookie['User']);
} catch (err) {}

const PostPage = () => {
	const [posts, setPosts] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [categories, setCategories] = useState([]);
	const category = [(searchParams.get('category') || '').split(',')];
	useEffect(() => {
		async function fetchCategories() {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
			if (response.ok) {
				const res = await response.json();
				setCategories(res.data);
			}
		}

		async function fetchPosts() {
			try {
				let response;
				if (user && user.login) {
					console.log(category[0][0], category.length > 0 && category[0][0] !== '');
					response = await fetch(
						`${process.env.REACT_APP_API_URL}/api/posts${
							category.length > 0 && category[0][0] !== '' ? '?category=' + category : ''
						}`,
						{
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${cookie['jwt']}`,
							},
						}
					);
				} else {
					const categor =
						category.length > 0 && category[0][0] !== '' ? '?category=' + JSON.stringify(category) : '';
					response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts${categor}`);
				}
				// console.log(`${process.env.REACT_APP_API_URL}/api/posts${category ? '?category=' + category : ''}`);
				if (!response.ok) {
					throw new Error('Network response was not ok.');
				}
				const data = await response.json();
				setPosts(data.data);
			} catch (error) {
				console.error('There was a problem fetching the posts:', error);
				setPosts([]);
			}
		}
		const interval = setInterval(() => {
			fetchCategories();
			fetchPosts();
		}, 500);

		return () => clearInterval(interval);
	}, [searchParams, categories]);

	return (
		<div className="allPosts">
			<HeaderComponent />
			<FilterListComponent
				categories={categories}
				setSearchParams={setSearchParams}
				searchParams={searchParams}
			></FilterListComponent>
			<div className="postList">
				{posts.map((post) => (
					<div className="postItem">
						<Post key={post.id} post={post} detail={false} />
					</div>
				))}
			</div>
		</div>
	);
};

export default PostPage;
