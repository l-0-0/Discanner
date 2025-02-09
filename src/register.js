import React, { useState } from "react";
import axios from "./axios";

export default function Registration(props) {
    let { isLogged, showWindow } = props;

    const [first, setFirst] = useState();
    const [last, setLast] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState(false);
    const [modal, setModal] = useState(false);

    const submit = () => {
        axios
            .post("/register", {
                first,
                last,
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
            .catch((err) => {
                console.log("error in registration: ", err);
            });
        setModal(true);
    };

    return (
        <div className="back" onClick={showWindow}>
            <div className="forms" onClick={(e) => e.stopPropagation()}>
                {error && (
                    <div className="error">
                        Oops! Something went wrong, try again!
                    </div>
                )}

                <input
                    onChange={(e) => setFirst(e.target.value)}
                    name="firstName"
                    placeholder="First Name"
                />
                <input
                    onChange={(e) => setLast(e.target.value)}
                    name="lastName"
                    placeholder="Last Name"
                />
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
                <button onClick={submit}>Submit</button>
            </div>
        </div>
    );
}
