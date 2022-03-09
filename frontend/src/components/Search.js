import React from "react";

import "./Search.css";

export default function Search({ searchTerm, setSearchTerm }) {
	return (
		<>
			<div className="searchBar">
				<input
					type="text"
					placeholder="Search"
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
				/>
			</div>
		</>
	);
}
