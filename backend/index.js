import dotenv from "dotenv";
import express from "express";
import bodyparser from "body-parser";
import { createPool } from "mysql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

import secrets from "./config/secrets.js";

const databaseConnection = createPool({
	connectionLimit: 10,
	host: "localhost",
	user: "root",
	password: "",
	database: "web2proj",
});

databaseConnection.getConnection(function (err, connection) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	connection.release();
});

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyparser.json());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

//--------------------PRODUCTS--------------------

app.get("/api/products", (req, res) => {
	databaseConnection.query(
		"SELECT `id`, `name`, `description`, `price`, `quantity` FROM `web2proj`.`products`",
		[],
		function (error, results, fields) {
			res.json(results);
		},
	);
});

app.post("/api/products", (req, res) => {
	const newItem = req.body;
	databaseConnection.query(
		"INSERT INTO `web2proj`.`products` SET ?",
		[newItem],
		function (error, results, fields) {
			res.setHeader("Location", `/api/products/${results.insertId}`)
				.status(201)
				.json({ id: results.insertId, ...newItem });
		},
	);
});

app.get("/api/products/:itemID", (req, res) => {
	databaseConnection.query(
		"SELECT `id`, `name`, `description`, `price`, `quantity` FROM `web2proj`.`products` WHERE `id` = ?",
		[req.params.itemID],
		function (error, results, fields) {
			if (results.length === 0) {
				res.status(404).send("Resource not found.");
			} else {
				res.json(results[0]);
			}
		},
	);
});

app.patch("/api/products/:itemID", (req, res) => {
	const replaceItem = req.body;
	databaseConnection.query(
		"UPDATE `web2proj`.`products` SET ? WHERE `id` = ?",
		[replaceItem, req.params.itemID],
		function (error, results, fields) {
			if (results.affectedRows !== 1) {
				res.status(404).send("Resource not found.");
			} else {
				databaseConnection.query(
					"SELECT `id`, `name`, `description`, `price`, `quantity` FROM `web2proj`.`products` WHERE `id` = ?",
					[req.params.itemID],
					function (suberror, subresults, subfields) {
						res.json(subresults[0]);
					},
				);
			}
		},
	);
});

app.delete("/api/products", (req, res) => {
	//split header
	let [authType, authHeader] = req.headers.authorization.split(" ");
	//if auth type is right
	if (authType === "Bearer") {
		//verify token
		jwt.verify(authHeader, "secrets.jwtSecret", function (err, decoded) {
			if (err) {
				//invalid token
				res.status(401).end();
			} else {
				//valid token
				databaseConnection.query("DELETE FROM `web2proj`.`products`");
				databaseConnection.query("ALTER TABLE `web2proj`.`products` AUTO_INCREMENT=1");
				res.end();
			}
		});
	} else {
		res.status(401).end();
	}
});

app.delete("/api/products/:itemID", (req, res) => {
	//try to delete product with id
	databaseConnection.query(
		"DELETE FROM `web2proj`.`products` WHERE id = ?",
		[req.params.itemID],
		function (error, results, fields) {
			//product not found
			if (results.affectedRows !== 1) {
				res.status(404).send("Resource not found.");
			}
			//product found and deleted
			res.end();
		},
	);
});

//--------------------USERS--------------------

const SALTROUNDS = 10;

function decodeAuthHeader(authHeader) {
	let [username, password] = Buffer.from(authHeader, "base64").toString("ascii").split(":");
	return [username, password];
}

app.post("/api/login", (req, res) => {
	//splite header
	let [authType, authHeader] = req.headers.authorization.split(" ");
	//basic or token login
	switch (authType) {
		case "Basic": {
			//decode creds
			let [username, password] = decodeAuthHeader(authHeader);
			//try to get account password
			databaseConnection.query(
				"SELECT `password` FROM `web2proj`.`users` WHERE `username` = ?",
				[username],
				function (error, results, fields) {
					if (results.length === 0) {
						//invalid username
						res.status(401).end();
					} else {
						bcrypt.compare(password, results[0].password).then((match) => {
							if (match) {
								//matching passwords
								let token = jwt.sign({ username: username }, secrets.jwtSecret, {
									expiresIn: "1h",
								});
								res.json({ token: token, username: username });
							} else {
								//invalid password
								res.status(401).end();
							}
						});
					}
				},
			);
			break;
		}
		case "Bearer": {
			//verify token
			jwt.verify(authHeader, secrets.jwtSecret, function (err, decoded) {
				if (err) {
					//invalid token
					res.status(401).end();
				} else {
					//valid token
					res.end();
				}
			});
			break;
		}
		default:
			res.status(401).send("login failed");
			break;
	}
});

app.post("/api/register", (req, res) => {
	let [authType, authHeader] = req.headers.authorization.split(" ");
	if (authType !== "Basic") {
		res.status(401).send("Invalid authorization");
		return;
	}
	let [username, password] = decodeAuthHeader(authHeader);
	databaseConnection.query(
		"SELECT COUNT(*) FROM `web2proj`.`users` WHERE `username` = ?",
		[username],
		function (error, results, fields) {
			if (error) throw error;
			if (results[0]["COUNT(*)"] === 0) {
				bcrypt.hash(password, SALTROUNDS, (bcrypterror, hash) => {
					if (bcrypterror) throw bcrypterror;
					databaseConnection.query("INSERT INTO `web2proj`.`users` SET ?", {
						username: username,
						password: hash,
					});
					let token = jwt.sign({ username: username }, secrets.jwtSecret, {
						expiresIn: "1h",
					});
					res.status(201).json({ token: token, username: username });
				});
			} else {
				res.status(400).send("User with this username already exists.");
			}
		},
	);
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
