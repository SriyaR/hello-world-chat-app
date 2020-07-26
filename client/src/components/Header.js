import React from "react";
import { Link } from "react-router-dom";
import Options from "./Options";

export default function Header() {
  return (
    <header id="header">
      <Link to="/">
        <h1 className="title">Hello World Chat App</h1>
      </Link>
      <Options />
    </header>
  );
}