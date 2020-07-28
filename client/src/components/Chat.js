import React, { useState, useContext, useEffect } from 'react';
import UserContext from "../context/userContext";

import config from '../config';
import io from 'socket.io-client';
import { Link } from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import BottomBar from '../BottomBar';

export default function App () {
	const { userData } = useContext(UserContext);
	const [chat, setChat] = useState([]);
	const [message, setMessage] = useState();
	const [response, setResponse] = useState();
		
	const handleContent = (event) => {
		setMessage(event.target.value);
	};
	
	const handleSubmit = (event) => {
		event.preventDefault();
		
		return{
			chat: [...chat,{
				sender: userData.user.name,
				message: message,
			}],
			message: '',
			};
	};
	
	const scrollToBottom = () => {
		const chat = document.getElementById('chat');
		chat.scrollTop = chat.scrollHeight;
	};
	useEffect(() => {
		const socket = io(config[process.env.NODE_ENV].endpoint);
		socket.on("init", data => {
		  setResponse(data);
		});

		// CLEAN UP THE EFFECT
		return () => socket.disconnect();
    //
  }, []);
	
    return (
      <div>
	  {userData.user ? (
	  <div className="App">
        <Paper id="chat" elevation={3}>
          {chat.map((el, index) => {
            return (
              <div key={index}>
                <Typography variant="body1" className="message">
                  {el.message}
                </Typography>
              </div>
            );
          })}
        </Paper>
        <BottomBar
          message={message}
          handleContent={handleContent.bind(this)}
          handleSubmit={handleSubmit.bind(this)}
        />
      </div>
    ):(
		<>
			<h2>You are not logged in</h2>
			<Link to="/login">Log in</Link>
		</>
	)}
	</div>);
};