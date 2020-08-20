import React, { useState } from "react";
import Logo from "./logo";
import Map from "./map";
import Registration from "./register";
import Login from "./login";

export default function App() {
    const [modal, setModal] = useState(false);
    const [regComp, setRegComp] = useState(false);
    const [logComp, setLogComp] = useState(false);

    const toggleModal = () => {
        setModal(true);
    };

    return (
        <>
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
            {regComp && <Registration />}
            {logComp && <Login />}
            <Logo />
            <Map />
        </>
    );
}
