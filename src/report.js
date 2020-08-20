import React, { useState, useEffect } from "react";
import FormToReport from "./formToReport";

import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import mapStyle from "./mapStyle";

const libraries = ["places"];
const secrets = require("../secrets");

export default function Reports() {
    const [points, setPoints] = useState([]);
    const [chosen, setChosen] = useState(null);

    const showThePoint = (e) => {
        console.log("e", e);
        setPoints((newPoint) => [
            ...newPoint,
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                time: new Date(),
            },
        ]);
    };

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
        googleMapsApiKey: secrets.REACT_APP_GOOGLE_MAPS_API_KEY,
        //places library to be able to search
        libraries,
    });

    if (loadError) {
        return "there is an error in loading the map";
    }
    if (!isLoaded) {
        return "loading map";
    }

    const dateChange = (time) => {
        let newTime = new Date(time);
        return newTime.toLocaleString("de-DE");
    };

    // console.log("posts", posts);

    return (
        <>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                options={options}
                onClick={showThePoint}
            >
                {points &&
                    points.map((point, id) => (
                        <Marker
                            key={id}
                            position={{
                                lat: point.lat,
                                lng: point.lng,
                            }}
                            onClick={() => {
                                setChosen(point);
                                console.log("point", point);
                            }}
                        />
                    ))}
                {chosen && (
                    <InfoWindow
                        position={{
                            lat: chosen.lat,
                            lng: chosen.lng,
                        }}
                        onCloseClick={() => {
                            setChosen(null);
                        }}
                    >
                        <div>
                            <FormToReport lat={chosen.lat} lng={chosen.lng} />
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </>
    );
}
