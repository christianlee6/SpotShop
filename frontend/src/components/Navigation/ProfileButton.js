import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { NavLink, useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';

import OpenModalMenuItem from './OpenModalMenuItem'
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push("/")
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu} className="profile-button">
      <i className="fa-sharp fa-solid fa-bars profile-menu-button"> </i>
      <span> </span>
      <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
      {user ? (
          <div className="account-buttons">
            <ul>{user.username}</ul>
            <ul>{user.firstName} {user.lastName}</ul>
            <ul style={{"borderBottom":"1px solid lightGray"}}>{user.email}</ul>
              <NavLink className="profile-actions" onClick={closeMenu} to={'/account'} style={{color: 'black'}}>Account</NavLink>
              <button className="profile-actions" onClick={logout}>Log out</button>
          </div>
        ) : (
            <div className="account-buttons">
                <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
                />
                <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
                />
            </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
