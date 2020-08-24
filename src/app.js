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
    const [window, setWindow] = useState(false);
    const [logout, setLogout] = useState(false);

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
        if (modal == false) {
            setModal(true);
        } else {
            setModal(false);
        }
    };

    const showWindow = () => {
        if (window == false) {
            setWindow(true);
        } else {
            setWindow(false);
        }
    };

    // const logout = () => {
    //     axios.get("/logout").then((data) => {
    //         console.log("data", data);
    //         if (data.success == true) {
    //             setLogout(true);
    //         }
    //     });
    // };

    console.log("modal", modal);
    console.log("window", window);
    return (
        <>
            <div className="main-div">
                <Logo />
                <div id="information">
                    <p>
                        collective mapping to scann the topography of violence
                    </p>
                    {/* <p>
                        DiScanner points at the everday cases of discrimination
                        under skin of this city. It is a collective mapping in
                        order to scannes the topography of violence.{" "}
                    </p> */}
                </div>

                {!isLoggedIn && (
                    <>
                        <div>
                            <p id="text-logo">DiScanner</p>
                        </div>
                        <button className="report-button" onClick={toggleModal}>
                            Report a case
                        </button>

                        {modal && (
                            <div className="modal">
                                <h2
                                    onClick={() => {
                                        setLogComp(true);
                                        setWindow(true);
                                    }}
                                >
                                    {" "}
                                    Log in{" "}
                                </h2>
                                <h2
                                    onClick={() => {
                                        setRegComp(true);
                                        setWindow(true);
                                    }}
                                >
                                    {" "}
                                    Register yourself{" "}
                                </h2>
                            </div>
                        )}
                        {window && (
                            <div>
                                {regComp && (
                                    <Registration
                                        isLogged={isLogged}
                                        showWindow={showWindow}
                                    />
                                )}
                                {logComp && (
                                    <Login
                                        isLogged={isLogged}
                                        showWindow={showWindow}
                                    />
                                )}
                            </div>
                        )}
                        <Map />
                    </>
                )}
            </div>

            {isLoggedIn &&
                users &&
                users.map((user, id) => {
                    return (
                        <div>
                            <button
                                className="report-button"
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
                                <p id="text-logo">DiScanner</p>
                                <div id="text">
                                    <p> welcome {user.first}!</p>
                                </div>
                                <div>
                                    <h2 className="logout">
                                        <a href="/logout">Logout</a>
                                    </h2>
                                </div>
                            </div>
                            {showPoints ? <Map /> : <Reports />}
                        </div>
                    );
                })}
        </>
    );
}
