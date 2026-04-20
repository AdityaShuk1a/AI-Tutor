import React from "react";
import "../styles/navbar.css";
import logo from "../assets/logo.svg";

const Navbar = () => {
  return (
    <nav className="cuemath-navbar">
      <div className="nav-container">
        <img className="brand-logo" src={logo} />

        <button className="exit-button" aria-label="Close session">
          <span className="cross-icon">&times;</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
