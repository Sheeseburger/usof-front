import { useEffect, useState } from 'react';
import getCookies from '../cookieReader';
import HeaderComponent from './HeaderComponent';
import { TextField, Tooltip } from '@mui/material';
import likeInactive from '../static/like_inactive.svg';
import likeActive from '../static/like_active.svg';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

let cookie;
let user = {};
try {
	cookie = getCookies();
	user = JSON.parse(cookie['User']);
} catch (err) {}

export default function CreateTagFieldComponent() {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
	});
	const [categories, setCategories] = useState();

	useEffect(() => {
		async function getCat() {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories/waiting`, {
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie['jwt']}` },
				});

				if (response.ok) {
					const res = await response.json();
					console.log(res);

					if (res) {
						setCategories(res.categories);
					} else {
					}
				}
			} catch (error) {}
		}

		const interval = setInterval(() => {
			getCat();
		}, 250);
		return () => clearInterval(interval);
	}, []);
	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async () => {
		if (!formData.title || !formData.description) {
			return;
		}
		const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories/waiting`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookie['jwt']}`,
			},
			method: 'POST',
			body: JSON.stringify(formData),
		});
		if (response.ok) {
			const res = await response.json();
			console.log(res);
		}
	};
	const addLike = async (id) => {
		try {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories/waiting/${id}/like`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookie['jwt']}`,
				},
				method: 'POST',
			});
			if (response.ok) {
				const res = await response.json();
				console.log(res);
			} else {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories/waiting/${id}/like`, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${cookie['jwt']}`,
					},
					method: 'DELETE',
				});
			}
		} catch (error) {}
	};
	async function deleteWaitingTag(id) {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories/waiting/${id}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookie['jwt']}`,
			},
			method: 'DELETE',
		});
	}

	return (
		<div className="flex">
			<HeaderComponent />
			<div className="edit-profile">
				<div className="grid-fields">
					<div className="grid-fields-item">
						<TextField
							onChange={handleInputChange}
							required
							id="outlined-required"
							label="Title"
							defaultValue={formData.title}
							name="title"
							inputProps={{ maxLength: 20 }}
						/>
					</div>
					<div className="grid-fields-item">
						{' '}
						<TextField
							onChange={handleInputChange}
							required
							id="outlined-required"
							label="Description"
							defaultValue={formData.description}
							name="description"
							inputProps={{ maxLength: 50 }}
						/>
					</div>
					<button onClick={handleSubmit} className="grid-fields-item button-30">
						Submit
					</button>
				</div>
			</div>
			<div className="WaitingContainer">
				{categories &&
					categories.map((el) => (
						<div className="categoryWaitingContainer">
							<div className="categoryTitle">
								<span className="titleCategory">
									{el.title}
									<Tooltip title="Delete">
										<DeleteForeverIcon onClick={() => deleteWaitingTag(el.id)} />
									</Tooltip>
								</span>
							</div>
							<div className="descriptionCategory">
								<span>{el.description}</span>
							</div>
							<div className="categoryImg">
								<img
									src={el.Users.some((us) => us.id === user.id) ? likeActive : likeInactive}
									alt=""
									onClick={() => addLike(el.id)}
								/>
								<span>{el.likeCount}</span>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
