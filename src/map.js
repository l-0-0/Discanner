import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "./axios";
import FormToReport from "./formToReport";
import SearchBox from "./search";

import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import mapStyle from "./mapStyle";

const libraries = ["places"];
const secrets = require("../secrets");

export default function Map(props) {
    const [allPoints, setAllPoints] = useState();
    const [currentMarker, setCurrentMarker] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/get-posts");

                setAllPoints(data);

                console.log("data getting from posts", data);
            } catch (err) {
                console.log("error in getting posts: ", err);
            }
        })();
    }, []);

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

    const mapRef = useRef();
    const onLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = useCallback(({ lat, lng }) => {
        console.log("hello from outside");
        // if (mapRef.current) {
        console.log("hello from inside");
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(16);
        // }
    }, []);

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

    return (
        <>
            <SearchBox panTo={panTo} />

            {/* // put some info window inside this: */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                options={options}
                onLoad={onLoad}
            >
                <div>
                    {allPoints &&
                        allPoints.map((each, id) => {
                            // console.log("each", each);
                            return (
                                <Marker
                                    key={id}
                                    position={{
                                        lat: Number(each.lat),
                                        lng: Number(each.lng),
                                    }}
                                    // icon={{
                                    //     url: "/points.png",
                                    //     scaledSize: new google.maps.Size(
                                    //         30,
                                    //         30
                                    //     ),
                                    //     origin: new google.maps.Point(0, 0),
                                    //     anchor: new google.maps.Point(15, 15),
                                    // }}
                                    onClick={() => setCurrentMarker(id)}
                                />
                            );
                        })}
                    {currentMarker && (
                        <InfoWindow
                            position={{
                                lat: Number(allPoints[currentMarker].lat),
                                lng: Number(allPoints[currentMarker].lng),
                            }}
                            onCloseClick={() => {
                                setCurrentMarker(null);
                            }}
                        >
                            <div className="info-window">
                                <h3>{allPoints[currentMarker].title}</h3>
                                <p>{dateChange(allPoints[currentMarker].ts)}</p>
                                <img
                                    src={
                                        allPoints[currentMarker].image ||
                                        "/index.png"
                                    }
                                />
                                <p>{allPoints[currentMarker].description}</p>
                                <p>
                                    This incident happend on:{" "}
                                    {dateChange(
                                        allPoints[currentMarker].time_incident
                                    )}
                                </p>
                            </div>
                        </InfoWindow>
                    )}
                </div>
            </GoogleMap>
        </>
    );
}
