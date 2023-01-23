import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal({}) {
    const history = useHistory()
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return (
            dispatch(sessionActions.login({ credential, password }))
                .then(closeModal)
                // .then(() => setShowLoginModal(false))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.message) setErrors([data.message]);
                })
        );
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
                <div className="login-header">Log In</div>
                <div className="line-break"></div>
                <div className="login-subheader">Welcome to SpotShop!</div>
                <div className="validation-errors">
                    {errors.length > 0 &&
                        errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </div>
                <div className="form-input-wrapper">
                    <label className="input-field">
                        Username or Email
                        <input
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required
                        />
                    </label>
                    <div className="form-input-break"></div>
                    <label className="input-field">
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                    <button type="submit" className="submit">Log In</button>
            </form>
        </div>
    );
}

export default LoginFormModal;
