import { TextField } from '@mui/material';
import { Button } from 'react-bootstrap';
import './../style/create-post.css';
export default function CreatePostDiv({ handleInputChange, formData, isEdit = false }) {
	return (
		<div className="flex create-post-body">
			<TextField
				id="filled-basic"
				label="Title"
				variant="filled"
				name="title"
				disabled={isEdit}
				className="create-post-body-item"
				value={formData.title}
				onChange={handleInputChange}
				inputProps={{ maxLength: 20 }}
			/>
			<TextField
				className="create-post-body-item"
				id="outlined-textarea"
				label="Whats wrong?"
				placeholder="How to center div?"
				name="content"
				rows={4}
				value={formData.content}
				onChange={handleInputChange}
				disabled={isEdit}
				// maxRows={20}
				multiline
				inputProps={{ maxLength: 500 }}
			/>
			<Button
				className="button-30 create-post-body-item"
				type="submit"
				fullWidth
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
				value={{ isEdit }}
			>
				{isEdit === true ? 'Edit' : 'Create'}
			</Button>
		</div>
	);
}
