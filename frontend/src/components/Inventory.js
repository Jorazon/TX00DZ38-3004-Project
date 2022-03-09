import React from "react";

import Item from "./Item";

export default function Inventory({ items, userLoggedIn, deleteFunction, editFunction }) {
	return (
		<div className="ItemContainer">
			{items.map((item) => {
				return (
					<Item
						key={item.id}
						item={item}
						userLoggedIn={userLoggedIn}
						editFunction={editFunction}
						deleteFunction={deleteFunction}
					/>
				);
			})}
		</div>
	);
}
