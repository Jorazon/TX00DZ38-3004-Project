import React, { useEffect, useState } from "react";

import Login from "./components/Login";
import AddItem from "./components/AddItem";
import Inventory from "./components/Inventory";
import Search from "./components/Search.js";

import "./App.css";

export default function App() {
	const [items, setItems] = useState([]);
	const [userLoggedIn, setUserLoggedIn] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	function refreshItems() {
		fetch("/api/products")
			.then((res) => res.json())
			.then((data) => setItems(data));
	}

	function createItem(item) {
		fetch("/api/products/", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(item),
		})
			.then((res) => res.json())
			.then((data) => {
				setItems([...items, data]);
			});
	}

	function editItem(index, newContent) {
		//update client side items for responsiveness
		setItems(
			items.map((item) => {
				//update data of item without modifying id possible
				return item.id !== index ? item : { ...item, ...newContent, id: index };
			}),
		);
		//update server side items
		fetch(`/api/products/${index}`, {
			method: "PATCH",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newContent),
		}).then((res) => {
			if (res.status !== 200) {
				refreshItems(); //if update fails get up to date data
			}
		});
	}

	function deleteItem(index) {
		fetch(`/api/products/${index}`, { method: "DELETE" }).then((res) => {
			if (res.status === 200) {
				setItems(items.filter((item) => item.id !== index));
			}
		});
	}

	//fetch products from api
	useEffect(() => {
		refreshItems();
	}, []);

	return (
		<>
			<nav>
				<Login userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
				{userLoggedIn && <AddItem createFunction={createItem} />}
				<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
			</nav>
			<Inventory
				items={items.filter((item) => item.name.toLowerCase().includes(searchTerm))}
				userLoggedIn={userLoggedIn}
				editFunction={editItem}
				deleteFunction={deleteItem}
			/>
		</>
	);
}
