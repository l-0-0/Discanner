import React from "react";
import Registration from "./register";
import Login from "./login";
import ResetPassword from "./resetpassword";
import { HashRouter, Route, Link } from "react-router-dom";

export default function Welcome(props) {
    // const style = {
    //     backgroundColor: "tomato",
    // };
    return (
        // <div style={style}>
        <HashRouter>
            <div className="welcome-page">
                <img className="logo-welcome" src="/logo-new.jpg" alt="logo" />
                <div className="welcome-page-text">
                    <p>Living in Kotti and Loving it?</p>
                    <h2>Join the KIEZ Community!</h2>
                </div>

                <Route exact path="/" component={Registration} />
                <Route path="/login" component={Login} />
                <Route path="/reset" component={ResetPassword} />
            </div>
        </HashRouter>
    );
}

//I can also put the function in a variable and call that in the render!
//const elem = <Welcome />
//ReactDOM.render(elem, document.querySelector("main"));
