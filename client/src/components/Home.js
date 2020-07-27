import React from "react";
import UserContext from "../context/userContext";
import Axios from "axios";
import { Link } from "react-router-dom";

class Home extends React.Component {
	
	static contextType = UserContext
	
	
	getData = () => {
		const name = this.context;
		console.log(name);
		const production  = 'https://hello-world-chat-app.herokuapp.com/';
		const development = 'http://localhost:5000/';
		const baseUrl = (process.env.NODE_ENV==="production" ? production : development);
		const data = {'name':name}
		Axios.post(
			baseUrl+"users/getRoom",
			data,
		).then(function (result) {
			this.setState({roomData: result.data.user.room});
		});
	}
	componentDidMount(){
		this.getData();
	}
	
	createTable = (roomData, index) => {
		if (!roomData.length) return null;
		
		roomData.map(() => (
			<div key={index}>
				<p>roomData.roomName</p>
			</div>
		));
	};
	
  render()
  {
	return(
	<div>
	  {this.context.userData.user ? (
			<table>
				{this.createTable(this.state.roomData)}
			</table>
		  ) : (
			<>
			  <h2>You are not logged in</h2>
			  <Link to="/login">Log in</Link>
			</>
		  )}
    </div>
    );
  }
}

export default Home;