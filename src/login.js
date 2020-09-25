import React, { useState } from "react";
import axios from "./axios";

export default function Login(props) {
    let { isLogged, showWindow } = props;
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState(false);

    const login = () => {
        axios
            .post("/login", {
                email,
                password,
            })
            .then(({ data }) => {
                if (data.success) {
                    isLogged(data.data);
                } else {
                    setError(true);
                }
            })
            .catch((err) => console.log("error in log in: ", err));
    };

    return (
        <div className="back" onClick={showWindow}>
            <div className="forms" onClick={(e) => e.stopPropagation()}>
                {error && (
                    <div className="error">
                        Something went wrong! Please try again.
                    </div>
                )}

                <input
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    placeholder="Email Address"
                />
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    placeholder="Password"
                />
                <button onClick={login}>Log in</button>
            </div>
        </div>
    );
}
