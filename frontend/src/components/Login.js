import React, { useEffect, useState } from "react";

import "./Login.css";
import "./Modal.css";

export default function Login({ userLoggedIn, setUserLoggedIn }) {
	const [active, setActive] = useState(false);
	const [logging, setLogging] = useState(false);
	const [registering, setRegistering] = useState(false);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	function login(user, pass, registermode = false) {
		fetch(`/api/${registermode ? "register" : "login"}`, {
			method: "POST",
			headers: {
				Authorization: "Basic " + window.btoa(`${user}:${pass}`).toString("base64"),
				"Content-Type": "application/x-www-form-urlencoded",
			},
		}).then((response) => {
			response.json().then((data) => {
				//on success
				if (response.status === 200 || response.status === 201) {
					//set storage items to data
					window.localStorage.token = data.token;
					window.localStorage.username = data.username;
					//try token
					authorize();
				}
			});
		});
	}

	function authorize() {
		//get token from storage
		const token = window.localStorage.token;
		//authorize with token
		fetch("/api/login", {
			method: "POST",
			headers: {
				Authorization: "Bearer " + token,
				"Content-Type": "application/x-www-form-urlencoded",
			},
		}).then((response) => {
			//on success
			if (response.status === 200) {
				//set logged in true
				setUserLoggedIn(true);
			} else {
				setUserLoggedIn(false);
			}
		});
	}

	function logout() {
		window.localStorage.token = "";
		window.localStorage.username = "";
		setUserLoggedIn(false);
	}

	function validate() {
		return username !== "" && password !== "";
	}

	function handleLogin() {
		if (validate()) {
			login(username, password);
			cancel();
		}
	}

	function handleRegister() {
		if (validate()) {
			login(username, password, true);
			cancel();
		}
	}

	function handleStartLogin() {
		setLogging(true);
		setRegistering(false);
		setActive(true);
	}

	function handleSelectLogin() {
		setLogging(true);
		setRegistering(false);
	}

	function handleSelectRegister() {
		setRegistering(true);
		setLogging(false);
	}

	function cancel() {
		setUsername("");
		setPassword("");
		setLogging(false);
		setRegistering(false);
		setActive(false);
	}

	//try to authorize with a token on opening page
	useEffect(authorize, []);

	return (
		<>
			{userLoggedIn && <b>{window.localStorage.username}</b>}
			{userLoggedIn && <button onClick={logout}>Log out</button>}
			{!userLoggedIn && <button onClick={handleStartLogin}>Login</button>}
			{active && (
				<>
					<div className="cancelBackdrop" onClick={cancel} />
					<form
						className="loginContainer Modal"
						onSubmit={(event) => event.preventDefault()}
					>
						<div className="buttonContainer">
							<div
								onClick={handleSelectLogin}
								className={`fakebutton ${logging ? "active" : ""}`}
							>
								Login
							</div>
							<div
								onClick={handleSelectRegister}
								className={`fakebutton ${registering ? "active" : ""}`}
							>
								Register
							</div>
						</div>
						<div className="loginForm">
							<label>
								Username
								<br />
								<input
									type="text"
									value={username}
									onChange={(event) => setUsername(event.target.value)}
								/>
							</label>
							<label>
								Password
								<br />
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(event) => setPassword(event.target.value)}
								/>
								<br />
								<label>
									Show password
									<input
										type="checkbox"
										checked={showPassword}
										onChange={(event) => setShowPassword(event.target.checked)}
									/>
								</label>
							</label>
							{active && logging && (
								<button type="submit" onClick={handleLogin}>
									Login
								</button>
							)}
							{active && registering && (
								<button type="submit" onClick={handleRegister}>
									Register
								</button>
							)}
						</div>
					</form>
				</>
			)}
		</>
	);
}
