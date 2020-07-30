import React , {useContext, useEffect, useState} from "react";
import UserContext from "../context/userContext";
import Axios from "axios";
import { Link } from "react-router-dom";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

export default function Home (){
	
	const { userData } = useContext(UserContext);
	const [ data, setData ] = useState([])
	
	useEffect(() => {
		if (userData.user)
		{
			async function getData()
			{
				const name = userData.user.name;
				const baseUrl = (process.env.NODE_ENV==="production" ? process.env.REACT_APP_PRODUCTION : process.env.REACT_APP_DEVELOPMENT);
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
		
		if (!data.length) return (<Link to="/addRoom"><Card className="roomCard"><CardContent> Create Room</CardContent></Card></Link>);
		
		var rooms = [<Link to="/addRoom"><Card className="roomCard"><CardContent> Create Room</CardContent></Card></Link>];
		rooms.push(data.map((room, index) => 
			(
			<Link to={"chat/"+room.roomName}>
			<Card className="roomCard" key={index} >
				<CardContent>{room.roomName}</CardContent>
			</Card>
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