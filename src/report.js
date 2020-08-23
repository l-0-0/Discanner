import React, { useState, useRef, useCallback } from "react";
import FormToReport from "./formToReport";
import SearchBox from "./search";
import axios from "./axios";

import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import mapStyle from "./mapStyle";

const libraries = ["places"];
const secrets = require("../secrets");

export default function Reports(props) {
    const [points, setPoints] = useState([]);
    const [chosen, setChosen] = useState(null);
    const [newCenter, setNewCenter] = useState();
    const [pointInfo, setPointInfo] = useState();

    const showThePoint = (e) => {
        console.log("e", e);
        let lat = e.latLng.lat();
        let lng = e.latLng.lng();
        setPoints((newPoint) => [
            ...newPoint,
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                time: new Date(),
            },
        ]);
        // console.log(lat, lng);
        setNewCenter({
            newLat: lat,
            newLng: lng,
        });
    };
    // console.log(newCenter);

    let center = {
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
        mapRef.current.setZoom(14);
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

    // // console.log("pointInfo", pointInfo);

    return (
        <div id="map-main">
            <SearchBox panTo={panTo} />
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={
                    newCenter
                        ? { lat: newCenter.newLat, lng: newCenter.newLng }
                        : center
                }
                zoom={12}
                options={options}
                onClick={showThePoint}
                onLoad={onLoad}
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

                                // showInfo();
                                console.log("point", point.pointInfo);
                            }}
                            icon={{
                                url: "/ar.png",
                                scaledSize: new google.maps.Size(60, 60),
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(20, 20),
                            }}
                        />
                    ))}
                {chosen && chosen.pointInfo && (
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
                            <div>
                                <div className="info-window">
                                    <h3>{chosen.pointInfo.title}</h3>
                                    <p>{dateChange(chosen.pointInfo.ts)}</p>
                                    <img
                                        src={
                                            chosen.pointInfo.image ||
                                            "/index.png"
                                        }
                                    />
                                    <p>{chosen.pointInfo.description}</p>
                                    <p>
                                        This incident happend on:{" "}
                                        {dateChange(
                                            chosen.pointInfo.time_incident
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </InfoWindow>
                )}
                {chosen && !chosen.pointInfo && (
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
                            <FormToReport
                                getInfo={(data) => (chosen.pointInfo = data[0])}
                                lat={chosen.lat}
                                lng={chosen.lng}
                            />
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
}
