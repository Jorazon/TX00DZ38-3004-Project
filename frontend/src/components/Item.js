import React, { useState } from "react";

export default function Item({ item, userLoggedIn, editFunction, deleteFunction }) {
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState(item.name);
	const [description, setDescription] = useState(item.description);
	const [price, setPrice] = useState(item.price);
	const [quantity, setQuantity] = useState(item.quantity);

	function save() {
		//send values for updating
		editFunction(item.id, {
			name: name,
			description: description,
			price: price,
			quantity: quantity,
		});
		//exit edit mode
		setEditing(false);
	}

	function cancel() {
		//restore values
		setName(item.name);
		setDescription(item.description);
		setPrice(item.price);
		setQuantity(item.quantity);
		//exit edit mode
		setEditing(false);
	}

	function edit(event) {
		//enter edit mode
		setEditing(true);
	}

	function remove() {
		//send item for removal
		deleteFunction(item.id);
	}

	function decrement() {
		//decrement quantity
		editFunction(item.id, { quantity: quantity - 1 });
		setQuantity(quantity - 1);
	}

	function increment() {
		//increment quantity
		editFunction(item.id, { quantity: quantity + 1 });
		setQuantity(quantity + 1);
	}

	return (
		<div className="item">
			<div>
				{editing ? (
					<input
						type="text"
						placeholder="Name"
						onChange={(event) => setName(event.target.value)}
						value={name}
					/>
				) : (
					<b>{name}</b>
				)}
				{!userLoggedIn && <br />}
				{userLoggedIn && (
					<div className="ButtonContainer">
						{editing && <button onClick={save}>Save</button>}
						{editing && <button onClick={cancel}>Cancel</button>}
						{!editing && <button onClick={edit}>Edit</button>}
						{!editing && <button onClick={remove}>Delete</button>}
					</div>
				)}
			</div>
			{editing ? (
				<textarea
					type="text"
					rows="7"
					placeholder="Description"
					onChange={(event) => setDescription(event.target.value)}
					value={description}
				/>
			) : (
				<p>{description}</p>
			)}
			<br />
			{editing ? (
				<input
					type="number"
					step="0.001"
					onChange={(event) => setPrice(event.target.value)}
					value={price}
				/>
			) : (
				price + "€"
			)}
			<br />
			<div>
				Quantity:
				{editing ? (
					<input
						type="number"
						step="1"
						onChange={(event) => setQuantity(event.target.value)}
						value={quantity}
					/>
				) : (
					quantity
				)}
				{!editing && userLoggedIn && (
					<div className="ButtonContainer">
						<button onClick={decrement}>-</button>
						<button onClick={increment}>+</button>
					</div>
				)}
			</div>
		</div>
	);
}
