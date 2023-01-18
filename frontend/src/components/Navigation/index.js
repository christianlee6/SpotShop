import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import logo from './images/logo.png'

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <div className='nav-bar-wrapper'>
        <div className='nav-bar'>
            <div>
                <NavLink exact to="/" className={"home-link"}>
                    <img style={{"height": "65px", "width":"65px"}} src={logo}></img>
                </NavLink>
            </div>
            <div style={{"width": "50px"}}></div>
            {isLoaded && (
                <div style={{"display": "flex", "alignItems": "center", "gap": "20px"}}>

                <NavLink to='/new' style={{textDecoration: "none", color: 'black', fontSize: "12.5px"}}>Shop Your Home Now</NavLink>
                <ProfileButton user={sessionUser} />
                </div>
            )}
        </div>
    </div>
  );
}

export default Navigation;
