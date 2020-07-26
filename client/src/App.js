import React from 'react';
import config from './config';
import io from 'socket.io-client';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import BottomBar from './BottomBar';
import './App.css';

class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			chat: [],
			content: '',
			from: '',
			to: '',
		};
	}
	
	componentDidMount(){
		this.socket = io(config[process.env.NODE_ENV].endpoint)
		this.socket.on('init', (msg) => {
			this.setState((state)=> ({
				chat: [...state.chat, ...msg.reverse()],
			}), this.scrollToBottom);
		});
	}
	
	handleContent(event){
		this.setState({
			content: event.target.value,
		});
	}
	
	handleFrom(event) {
		this.setState({
		from: event.target.value,
		});
	}
	handleTo(event) {
		this.setState({
			to: event.target.value,
		});
	}
	
	handleSubmit(event){
		console.log(event);
		event.preventDefault();
		this.setState((state)=>{
			console.log(state);
			console.log('this', this.socket);
			this.socket.emit('message',{
				from: state.from,
				to: state.to,
				content: state.content,
			});
			return{
				chat: [...state.chat,{
					from: state.from,
					to: state.to,
					content: state.content,
				}],
				content: '',
			};
		}, this.scrollToBottom);
	}
	
	scrollToBottom() {
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
	}
	
	render() {
    return (
      <div className="App">
        <Paper id="chat" elevation={3}>
          {this.state.chat.map((el, index) => {
            return (
              <div key={index}>
                <Typography variant="caption" className="from">
                  {el.from}
                </Typography>
				<Typography variant="caption" className="to">
                  {el.to}
                </Typography>
                <Typography variant="body1" className="content">
                  {el.content}
                </Typography>
              </div>
            );
          })}
        </Paper>
        <BottomBar
          content={this.state.content}
          handleContent={this.handleContent.bind(this)}
          handleFrom={this.handleFrom.bind(this)}
		  handleTo={this.handleTo.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
          from={this.state.from}
		  to={this.state.to}
        />
      </div>
    );
  }
};


export default App;
