import React from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/session";

const DemoUser = () => {
    const dispatch = useDispatch()

    const loginDemoUser = () => {
        window.alert("You can now explore all of the site's features as a Demo User!")
        return dispatch(login({
            credential: "Demo-lition",
            password: "password"
        }))
    }

    return (
        <>
            <div id="demo-user" onClick={loginDemoUser}>
                Log In As Demo User
            </div>
        </>
    )
}

export default DemoUser;
