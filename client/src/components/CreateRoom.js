import React, { useState, useContext } from "react";
import UserContext from "../context/userContext";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { Link } from "react-router-dom";
import ErrorNotice from "./ErrorNotice";

export default function CreateRoom() {
  const { userData } = useContext(UserContext);
  const blankUser = {username:''};
  const [userList, setUsers] = useState([
    {...blankUser}
  ]);
  const addUser = () => {
    setUsers([...userList, {...blankUser}]);
  };
  const [name, setName] = useState();
  const [error, setError] = useState();

  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
	  var users = [];
	for(var idx in userList)
	  {
		users.push(userList[idx].username);
	  }
      const newRoom = { users, name };
	  const production  = 'https://hello-world-chat-app.herokuapp.com/';
	  const development = 'http://localhost:5000/';
	  const baseUrl = (process.env.NODE_ENV==="production" ? production : development);
      await Axios.post(
        baseUrl+"rooms/create", newRoom);
      history.push('/home');
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };
	const handleUserChange = (e) => {
	  const updatedUsers = [...userList];
	  updatedUsers[e.target.dataset.idx][e.target.className] = e.target.value;
	  setUsers(updatedUsers);
	};
	
  return (
  <div>
	{userData.user ? (
    <div className="page">
      <h2>Create Room</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form className="form" onSubmit={submit}>
		<label htmlFor="register-name">Room name</label>
        <input
          id="register-name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />	
		<input type="button" value="Add New User" onClick={addUser}/>      
		  {
			userList.map((val, idx) => {
			  const nameId = 'name-${idx}';
			  return (
				<div key={'user-${idx}'}>
				  <label htmlFor={nameId}>{`User #${idx + 1}`}</label>
				  <input
					type="text"
					name={nameId}
					data-idx={idx}
					id={nameId}
					className="username" 
					onChange={handleUserChange}
				  />
				</div>
			  );      
			})
		  }
        <input type="submit" value="Register" />
      </form>
    </div>):(
				<>
				  <h2>You are not logged in</h2>
				  <Link to="/login">Log in</Link>
				</>
	)}
	</div>
  );
}