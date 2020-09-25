import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "./axios";
import FormToReport from "./formToReport";
import SearchBox from "./search";
import QRCodeGenerator from "./qr";

import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import mapStyle from "./mapStyle";
import { Link } from "react-router-dom";

const libraries = ["places"];
const secrets = require("../secrets");

export default function Map() {
    const [allPoints, setAllPoints] = useState();
    const [currentMarker, setCurrentMarker] = useState(null);
    const [eachInfo, setEachInfo] = useState();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/get-posts");
                setAllPoints(data);
            } catch (err) {
                console.log("error in getting posts: ", err);
            }
        })();
    }, []);

    useEffect(() => {
        if (allPoints) {
            const markerId = location.pathname.slice(1);
            const markerIdx = allPoints.findIndex(
                (point) => point.id == markerId
            );
            console.log(markerIdx);
            console.log(allPoints);
            if (!isNaN(markerIdx)) {
                setCurrentMarker(markerIdx);
            }
        }
    }, [allPoints]);

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
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(16);
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

    const eachPost = (id) => {
        axios
            .get("/each-point/" + id)
            .then(({ data }) => {
                console.log("data", data);
                setEachInfo(data);
            })
            .catch((err) => {
                console.log("error in each post", err);
            });
    };

    console.log("eachInfo", eachInfo);
    return (
        <div id="map-main">
            <SearchBox panTo={panTo} />

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                options={options}
                onLoad={onLoad}
            >
                <div id="map-main">
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
                                    icon={{
                                        url: "/tt.png",
                                        scaledSize: new google.maps.Size(
                                            40,
                                            40
                                        ),
                                        origin: new google.maps.Point(0, 0),
                                        anchor: new google.maps.Point(20, 20),
                                    }}
                                    onClick={() => {
                                        console.log(id);
                                        setCurrentMarker(id);
                                    }}
                                />
                            );
                        })}
                    {allPoints && allPoints[currentMarker] && (
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
                                <div className="desc">
                                    <p>
                                        {allPoints[currentMarker].description}
                                    </p>
                                </div>
                                <p>
                                    This incident happend on:{" "}
                                    {dateChange(
                                        allPoints[currentMarker].time_incident
                                    )}
                                </p>

                                <QRCodeGenerator
                                    id={allPoints[currentMarker].id}
                                    text={`http://localhost:8080/${allPoints[currentMarker].id}`}
                                    size={100}
                                />
                            </div>
                        </InfoWindow>
                    )}
                </div>
            </GoogleMap>
        </div>
    );
}
