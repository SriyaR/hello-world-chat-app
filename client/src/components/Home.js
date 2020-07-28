import React , {useContext, useEffect, useState} from "react";
import UserContext from "../context/userContext";
import Axios from "axios";
import { Link } from "react-router-dom";

export default function Home (){
	
	const { userData } = useContext(UserContext);
	const [ data, setData ] = useState([])
	
	useEffect(() => {
		if (userData.user)
		{
			async function getData()
			{
				const name = userData.user.name;
				const production  = 'https://hello-world-chat-app.herokuapp.com/';
				const development = 'http://localhost:5000/';
				const baseUrl = (process.env.NODE_ENV==="production" ? production : development);
				const data = {'name':name}
				var resData;
				await Axios.post(
					baseUrl+"users/getRoom",
					data,
				).then(function (result) {
					resData= result.data.user.room;
				});
				setData(resData);
			}
			getData();
		}
		
	});
	
	const createTable = (index) => {
		if (!data) return null;
		
		if (!data.length) return (<div> Create Room </div>);
		
		var rooms = [<Link to="/addRoom"><div> Create Room </div></Link>];
		rooms.push(data.map((room, index) => 
			(
			<Link to={"chat/"+room.roomName}>
			<div key={index} >
				<p>{room.roomName}</p>
			</div>
			</Link>
		)));
		return rooms;
	};
	
	return(
		<div>
		  {userData.user ? (
			<div>
			  {createTable()}
			</div>
			  ) : (
				<>
				  <h2>You are not logged in</h2>
				  <Link to="/login">Log in</Link>
				</>
			  )}
		</div>
	);
}