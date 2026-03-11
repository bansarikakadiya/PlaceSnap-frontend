import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../context/auth-context";
import './NavLinks.css';

const NavLinks = props => {
    const auth = useContext(AuthContext);

    return <ul className="nav-links" onClick={props.onClick}>
        <li>
            <NavLink to="/">All Users</NavLink>
        </li>
        {auth.isLoggedIn && (
         <li>
            <NavLink to={`/${auth.userId}/places`}>My Place</NavLink>
        </li>
        )}
        {auth.isLoggedIn && (
         <li>
            <NavLink to="/places/new">Add Place</NavLink>
        </li>
        )}
        {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Logout</button>
        </li>
      )}
    </ul>

};

export default NavLinks;