import React, { useState } from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import mapStyle from "./mapStyle";

export default function Map() {
    const [points, setPoints] = useState([]);

    const libraries = ["places"];

    const center = {
        lat: 52.520008,
        lng: 13.404954,
    };

    const containerStyle = {
        width: "100vw",
        height: "100vh",
    };

    const options = {
        styles: mapStyle,
        //get rid of default things on the map
        disableDefaultUI: true,
        zoomControl: true,
    };

    //the hook gives us back isLoaded and loadError. we use these
    //two variables to know if our google script is ready and we
    //can start working with the map!
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyC7Zs8RiI5LMRnOjuOPKOWmyXHwQi5C5Y8",
        //places library to be able to search
        libraries,
    });

    if (loadError) {
        return "there is an error in loading the map";
    }
    if (!isLoaded) {
        return "loading map";
    }

    const showThePoint = (e) => {
        console.log("e", e);
    };

    return (
        <>
            {/* // put some info window inside this: */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                options={options}
                onClick={showThePoint}
            />
        </>
    );
}
