import React from "react";
import Logo from "./logo";
import Map from "./map";
import Reports from "./report";

import { BrowserRouter, Route } from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter>
            <>
                <Logo />
                <Map />
            </>
        </BrowserRouter>
    );
}
