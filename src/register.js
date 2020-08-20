import React, { useState } from "react";
import axios from "./axios";
import Reports from "./report";

export default function Registration(props) {
    let { isLogged } = props;

    const [first, setFirst] = useState();
    const [last, setLast] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState(false);
    const [canReport, setCanReport] = useState(false);
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
                // console.log("data in register", data);
                if (data.success) {
                    isLogged(data.data);
                    setCanReport(true);
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
        <>
            <div className="forms">
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

                <div className="welcome-link">
                    <p>Are you already a member?</p>
                </div>
            </div>

            {canReport && <Reports />}
        </>
    );
}
