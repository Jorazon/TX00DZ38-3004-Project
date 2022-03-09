import React, { useState } from "react";

import "./AddItem.css";
import "./Modal.css";

export default function AddItem({ createFunction }) {
	const [adding, setAdding] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [quantity, setQuantity] = useState("");

	function add() {
		setAdding(true);
	}

	function cancel() {
		setName("");
		setDescription("");
		setPrice("");
		setQuantity("");
		setAdding(false);
	}

	function create() {
		createFunction({
			name: name,
			description: description,
			price: price,
			quantity: quantity,
		});
		cancel();
	}

	return (
		<>
			{!adding && <button onClick={add}>Add item</button>}
			{adding && (
				<>
					<div className="cancelBackdrop" onClick={cancel} />
					<div className="createForm Modal">
						<label htmlFor="name">
							Name
							<br />
							<input
								type="text"
								id="name"
								value={name}
								onChange={(event) => setName(event.target.value)}
							/>
						</label>
						<label htmlFor="description">
							Description
							<br />
							<textarea
								id="description"
								rows="7"
								value={description}
								onChange={(event) => setDescription(event.target.value)}
							/>
						</label>
						<label htmlFor="price">
							Price
							<br />
							<input
								type="number"
								id="price"
								value={price}
								onChange={(event) => setPrice(event.target.value)}
							/>
						</label>
						<label htmlFor="quantity">
							Quantity
							<br />
							<input
								type="number"
								id="quantity"
								value={quantity}
								onChange={(event) => setQuantity(event.target.value)}
							/>
						</label>
						<div>
							<button onClick={cancel}>Cancel</button>
							<button onClick={create}>Add</button>
						</div>
					</div>
				</>
			)}
		</>
	);
}
