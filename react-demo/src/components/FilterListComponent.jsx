import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const names = [
	'Oliver Hansen',
	'Van Henry',
	'April Tucker',
	'Ralph Hubbard',
	'Omar Alexander',
	'Carlos Abbott',
	'Miriam Wagner',
	'Bradley Wilkerson',
	'Virginia Andrews',
	'Kelly Snyder',
];

function getStyles(name, personName, theme) {
	return {
		fontWeight:
			personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
	};
}
export default function MultipleSelectChip({ categories, setSearchParams, searchParams }) {
	const theme = useTheme();
	const [selectedCategories, setSelectedCategories] = React.useState([]);

	const handleChange = (event) => {
		const {
			target: { value },
		} = event;
		setSelectedCategories(value);
		setSearchParams('category=' + value.join(','));
	};

	return (
		<div className="filtersContainer">
			<FormControl sx={{ m: 1, width: 300 }}>
				<InputLabel id="demo-multiple-chip-label">Tags</InputLabel>
				<Select
					labelId="demo-multiple-chip-label"
					id="demo-multiple-chip"
					multiple
					value={selectedCategories}
					onChange={handleChange}
					input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
					renderValue={(selected) => (
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
							{selected.map((value) => (
								<Chip key={value} label={categories.find((category) => category.id === value)?.title} /> // Отображение названия категории по ID
							))}
						</Box>
					)}
					MenuProps={MenuProps}
				>
					{categories.map((category) => (
						<MenuItem
							key={category.id}
							value={category.id}
							style={getStyles(category.title, selectedCategories, theme)}
						>
							{category.title}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<button
				className="clear-filters button-30 "
				onClick={() => {
					setSearchParams('');
					setSelectedCategories([]);
				}}
			>
				clean filters
			</button>
		</div>
	);
}
