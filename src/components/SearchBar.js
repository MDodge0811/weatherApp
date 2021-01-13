import React from 'react';

const SearchBar = ({ value, onChange, onSubmit, error }) => {
	return (
		<div className="container p-3">
			<form onSubmit={onSubmit}>
				<h1>Whats the weather like in...</h1>
				<input
					type="text"
					value={value}
					className="input is-small"
					placeholder="US City, State"
					onChange={onChange}
				/>
				<p className="is-size-7 is-pulled-left">ex: Midland, MI</p>
				{handleError(error)}
			</form>
		</div>
	);
};

const handleError = (error) => {
	if (error) {
		return (
			<p className="is-pulled-right is-size-7 has-text-danger has-text-weight-semibold">
				{error}
			</p>
		);
	}
};

export default SearchBar;
