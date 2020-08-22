import React, { useState, useEffect } from "react";
import axios from "./axios";
import Logo from "./logo";
import Map from "./map";
import Registration from "./register";
import Login from "./login";
import Reports from "./report";

export default function App() {
    const [modal, setModal] = useState(false);
    const [regComp, setRegComp] = useState(false);
    const [logComp, setLogComp] = useState(false);
    const [isLoggedIn, setIsLogedIn] = useState(false);
    const [users, setUsers] = useState();
    const [button, setButton] = useState("Don't show the points");
    const [showPoints, setShowPoints] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/user");

                console.log("data in users route", data);

                if (data.length != 0) {
                    setIsLogedIn(true);
                    setUsers(data);
                } else {
                    setIsLogedIn(false);
                }
            } catch (err) {
                console.log("error in finding user: ", err);
            }
        })();
    }, []);

    useEffect(() => {
        if (users && users.length) {
            setIsLogedIn(true);
        }
    }, [users]);

    // const userLogged = () => {
    //     setIsLogedIn(true);
    // };

    const isLogged = (data) => {
        setUsers(data);
    };

    const toggleModal = () => {
        setModal(true);
    };

    // const showAll = () => {
    //     if (button == "Show all the points") {
    //         setButton("Don't show the points");
    //     } else {
    //         setButton("Show all the points");
    //     }
    // };

    // console.log("users", users);
    return (
        <>
            <Logo />

            {isLoggedIn &&
                users &&
                users.map((user, id) => {
                    return (
                        <div>
                            <button
                                onClick={() => {
                                    if (button == "Don't show the points") {
                                        setShowPoints(false);
                                        setButton("Show all the points");
                                    } else {
                                        console.log("reports");
                                        setShowPoints(true);
                                        setButton("Don't show the points");
                                    }
                                }}
                            >
                                {button}
                            </button>
                            <div key={id}>
                                <p>
                                    {" "}
                                    welcome {user.first} {user.last} to X-ray
                                    Berlin
                                </p>
                                <a href="/logout">Logout</a>
                            </div>
                            {showPoints ? (
                                <Map />
                            ) : (
                                <Reports toggleModal={toggleModal} />
                            )}
                            {/* <Reports /> */}
                        </div>
                    );
                })}

            {!isLoggedIn && (
                <div>
                    <div>
                        <button onClick={toggleModal}>report a case</button>
                    </div>
                    {modal && (
                        <div>
                            <p
                                onClick={() => {
                                    setLogComp(true);
                                }}
                            >
                                {" "}
                                Log in{" "}
                            </p>
                            <p
                                onClick={() => {
                                    setRegComp(true);
                                }}
                            >
                                {" "}
                                Register yourself{" "}
                            </p>
                        </div>
                    )}
                    {regComp && <Registration isLogged={isLogged} />}
                    {logComp && <Login isLogged={isLogged} />}
                    <Map />
                </div>
            )}
        </>
    );
}
