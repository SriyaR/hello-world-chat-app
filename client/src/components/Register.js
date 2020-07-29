import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import ErrorNotice from "./ErrorNotice";

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [error, setError] = useState();

  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const newUser = { email, password, name };
	  const production  = 'https://hello-world-chat-app.herokuapp.com/';
	  const development = 'http://localhost:5000/';
	  const baseUrl = (process.env.NODE_ENV==="production" ? production : development);
      await Axios.post(
        baseUrl+"users/register", newUser);
      history.push('/');
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <div className="page">
      <h3>REGISTER</h3>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form className="form" onSubmit={submit}>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="register-name">Display name</label>
        <input
          id="register-name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />

        <input type="submit" value="Register" />
      </form>
    </div>
  );
}