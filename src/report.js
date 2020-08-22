import React, { useState, useRef, useCallback } from "react";
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

export default function Reports(props) {
    let { toggleModal } = props;
    const [points, setPoints] = useState([]);
    const [chosen, setChosen] = useState(null);
    const [newCenter, setNewCenter] = useState();

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

    return (
        <>
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

                                console.log("point", point);
                            }}
                            icon={{
                                url: "/points.png",
                                scaledSize: new google.maps.Size(40, 40),
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(20, 20),
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
                            <FormToReport
                                toggleModal={toggleModal}
                                lat={chosen.lat}
                                lng={chosen.lng}
                            />
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </>
    );
}
