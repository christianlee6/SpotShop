import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import {Redirect, useHistory} from "react-router-dom"
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user)
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();


  if (sessionUser) return <Redirect to="/" />

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors)
        });
    }
    return setErrors(['Passwords must match']);
  };

  return (
    <div className="signup-wrapper">

      <form onSubmit={handleSubmit} className="signup-form-wrapper">
        <div className="signup-header">
            Sign Up
        </div>
        <div className="line-break"></div>
        <div className="signup-subheader">Sign Up For SpotShop</div>
        <div className="validation-errors">
        {errors.length > 0 &&
                        errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </div>
        <div className="form-input-wrapper">

        <label className="input-field">
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </label>
        <div className="form-input-break"></div>
        <label className="input-field">
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
        </label>
        <div className="form-input-break"></div>
        <label className="input-field">
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            />
        </label>
        <div className="form-input-break"></div>
        <label className="input-field">
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            />
        </label>
        <div className="form-input-break"></div>
        <label className="input-field" >
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </label>
        <div className="form-input-break"></div>
        <label className="input-field">
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
        </label>
            </div>
        <button className="submit" type="submit">Sign Up</button>
      </form>
            </div>

  );
}

export default SignupFormModal;
