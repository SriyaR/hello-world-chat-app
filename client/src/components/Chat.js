import React from 'react';

import config from '../config';
import io from 'socket.io-client';
import { Link } from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import BottomBar from '../BottomBar';

class App extends React.Component{
	constructor(props){
        super(props);

		this.state = {
			chat: [],
			message: '',
			sender: localStorage.getItem("username"),
			room: window.location.href.split("/").slice(-1)[0],
		};
	}

	componentDidMount(){
		if (this.state.sender)
		{
			this.socket = io(config[process.env.NODE_ENV].endpoint)
			this.socket.emit('room', {
				room: this.state.room,
			});
			this.socket.on('init', (msg) => {
				this.setState((state)=> ({
					chat: [...state.chat, ...msg.reverse()],
				}), this.scrollToBottom);
			});
			this.socket.on('push', (msg) => {
			  this.setState((state) => ({
				chat: [...state.chat, msg],
			  }), this.scrollToBottom);
			});
		}
	}

	handleContent(event){
		this.setState({
			message: event.target.value,
		});
	}
	
	handleSubmit = (event) => {
		event.preventDefault();
		this.setState((state)=>{
			console.log(state);
			console.log('this', this.socket);
			this.socket.emit('message',{
				sender: localStorage.getItem("username"),
				room: this.state.room,
				message: this.state.message,
			});
			return{
				chat: [...state.chat,{
					sender: localStorage.getItem("username"),
					room: this.state.room,
					message: this.state.message,
				}],
				message: '',
			};
		}, this.scrollToBottom);
	};
	
	scrollToBottom() {
		const chat = document.getElementById('chat');
		chat.scrollTop = chat.scrollHeight;
	}
	
	render() {
		return (
		  <div>
		  {this.state.sender ? (
		  <div className="App">
			<Paper id="chat" elevation={3}>
			  {this.state.chat.map((el, index) => {
				return (
				  <div className="msg" key={index}>
					<Typography variant="caption" className="sender">
					  {el.sender}
					</Typography>
					<Typography variant="body1" className="message">
					  {el.message}
					</Typography>
				  </div>
				);
			  })}
			</Paper>
			<BottomBar
			  message={this.state.message}
			  handleContent={this.handleContent.bind(this)}
			  handleSubmit={this.handleSubmit.bind(this)}
			/>
		  </div>
		):(
			<>
				<h2>You are not logged in</h2>
				<Link to="/login">Log in</Link>
			</>
		)}
		</div>);
	}
};

export default App; 