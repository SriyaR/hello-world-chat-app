import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import UserContext from "./context/userContext";
import Axios from "axios";
import './App.css';

export default function App()
{
	const [userData, setUserData] = useState({
		token: undefined,
		user: undefined,
	});

	useEffect(() => {
		const checkLoggedIn = async () => {
			let token = localStorage.getItem("auth-token");
			if (token === null) {
				localStorage.setItem("auth-token", "");
				token = "";
			}
			const userRes = await Axios.get("http://localhost:5000/users/", {
				headers: { "x-auth-token": token },
			});
			setUserData({
				token,
				user: userRes.data,
			});
		};

		checkLoggedIn();
	}, []);

	return (
		<>
		  <BrowserRouter>
			<UserContext.Provider value={{ userData, setUserData }}>
			  <div className="container">
				<Header/>
				<Switch>
				  <Route exact path="/" component={Login} />
				  <Route path="/register" component={Register} />
				  <Route path="/chat" component={Chat} />
				</Switch>
			  </div>
			</UserContext.Provider>
		  </BrowserRouter>
		</>
  );
}
