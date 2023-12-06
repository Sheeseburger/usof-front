import * as React from 'react';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import CreatePostDiv from './createPostComponent';
import getCookies from '../cookieReader';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
const cookie = getCookies();

function not(a, b) {
	return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
	return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
	return [...a, ...not(b, a)];
}

export default function SelectAllTransferList() {
	const { id } = useParams();

	const [errorMessage, setErrorMessage] = React.useState('');

	const navigate = useNavigate();
	const location = useLocation();

	const handleSubmit = async (event) => {
		event.preventDefault();
		const bodyData = {
			title: formData.title,
			content: formData.content,
			categories: right.map((el) => el.id),
		};
		console.log(bodyData);
		let response;
		if (!isEdit) {
			response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookie['jwt']}`,
				},
				body: JSON.stringify(bodyData),
			});
		} else {
			response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookie['jwt']}`,
				},
				body: JSON.stringify({ categories: bodyData.categories, status: bodyData.status }),
			});
		}
		if (response.ok) {
			if (location.state?.from) {
				navigate(location.state.from);
			}
			navigate('/');
		} else {
			const errorData = await response.json();
			console.error('Server error:', errorData);
			setErrorMessage('There was an error.\n' + errorData.message);
		}
	};

	const [checked, setChecked] = React.useState([]);
	const [left, setLeft] = React.useState([]);
	const [right, setRight] = React.useState([]);
	const [isEdit, setIsEdit] = React.useState(false);
	const [formData, setFormData] = React.useState({
		title: '',
		content: '',
	});
	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};
	React.useEffect(() => {
		async function fetchCategories() {
			try {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${cookie['jwt']}`,
					},
				});
				if (!response.ok) {
					throw new Error('Network response was not ok.');
				}
				const data = await response.json();
				setLeft(data.data);
			} catch (error) {
				console.error('There was a problem fetching the posts:', error);
				setLeft([]);
			}
		}
		const fetchData = async () => {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookie['jwt']}`,
				},
			});
			if (response.ok) {
				const res = await response.json();
				setFormData(res.data);
			}
		};
		const fetchPostCategories = async () => {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${id}/categories`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookie['jwt']}`,
				},
			});

			if (!response.ok) {
				throw new Error('Cant get categories for edit post.');
			}
			const responseCategories = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookie['jwt']}`,
				},
			});
			if (!responseCategories.ok) {
				throw new Error('Network response was not ok.');
			}
			const dataCategories = await responseCategories.json();
			const data = await response.json();
			const allCategories = dataCategories.data;
			const postCategories = data.data;
			console.log(postCategories);
			console.log(allCategories);
			const filteredLeft = allCategories.filter(
				(category) => !postCategories.some((postCategory) => postCategory.id === category.id)
			);
			const filteredRight = allCategories.filter((category) =>
				postCategories.some((postCategory) => postCategory.id === category.id)
			);
			console.log(filteredLeft);

			setLeft(filteredLeft);
			setRight(filteredRight);
		};
		// const interval = setInterval(() => {
		if (id) {
			setIsEdit(true);
			fetchData();
			fetchPostCategories();
		} else {
			fetchCategories();
		}
		// }, 250);

		// return () => clearInterval(interval);
	}, []);

	const leftChecked = intersection(checked, left);
	const rightChecked = intersection(checked, right);

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const numberOfChecked = (items) => intersection(checked, items).length;

	const handleToggleAll = (items) => () => {
		if (numberOfChecked(items) === items.length) {
			setChecked(not(checked, items));
		} else {
			setChecked(union(checked, items));
		}
	};

	const handleCheckedRight = (event) => {
		event.preventDefault();
		setRight(right.concat(leftChecked));
		setLeft(not(left, leftChecked));
		setChecked(not(checked, leftChecked));
	};

	const handleCheckedLeft = () => {
		setLeft(left.concat(rightChecked));
		setRight(not(right, rightChecked));
		setChecked(not(checked, rightChecked));
	};

	const customList = (title, items) => (
		<Card>
			<CardHeader
				sx={{ px: 2, py: 1 }}
				avatar={
					<Checkbox
						onClick={handleToggleAll(items)}
						checked={numberOfChecked(items) === items.length && items.length !== 0}
						indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
						disabled={items.length === 0}
						inputProps={{
							'aria-label': 'all items selected',
						}}
					/>
				}
				title={title}
				subheader={`${numberOfChecked(items)}/${items.length} selected`}
			/>
			<Divider />
			<List
				sx={{
					width: 200,
					height: 230,
					bgcolor: 'background.paper',
					overflow: 'auto',
				}}
				dense
				component="div"
				role="list"
			>
				{items.map((value) => {
					const labelId = `transfer-list-all-item-${value.title}-label`;

					return (
						<ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
							<ListItemIcon>
								<Checkbox
									checked={checked.indexOf(value) !== -1}
									tabIndex={-1}
									disableRipple
									inputProps={{
										'aria-labelledby': labelId,
									}}
								/>
							</ListItemIcon>
							<ListItemText id={labelId} primary={`${value.title}`} />
						</ListItem>
					);
				})}
			</List>
		</Card>
	);

	return (
		<form onSubmit={handleSubmit}>
			{errorMessage && (
				<Typography variant="body1" color="error" align="center">
					{errorMessage}
				</Typography>
			)}
			<div className="grid">
				<div className="grid-item">
					{customList('Categories', left)}
					<div className="action-button button-30" onClick={handleCheckedRight}>
						add categories
					</div>
				</div>
				<div className="grid-item">
					<CreatePostDiv
						handleInputChange={handleInputChange}
						formData={formData}
						isEdit={isEdit}
					></CreatePostDiv>
				</div>
				<div className="grid-item">
					{customList('Chosen', right)}
					<div className="action-button button-30" onClick={handleCheckedLeft}>
						remove categories
					</div>
				</div>
			</div>
		</form>
	);
}
