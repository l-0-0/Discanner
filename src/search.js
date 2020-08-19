import React from "react";

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

export default function SearchBox() {
    const {
        // ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 52.520008, lng: () => 13.404954 },
            radius: 5 * 1000,
        },
    });

    console.log("data", data);
    console.log("status", status);

    return (
        <>
            <div>
                <input
                    value={value}
                    type="text"
                    name="search"
                    placeholder="Enter the address"
                    onChange={(e) => setValue(e.target.value)}
                    onSelect={(selected) => {
                        console.log(selected);
                    }}
                />
            </div>
            <div>
                {status == "OK" &&
                    data.map(({ description, id }) => {
                        return (
                            <div key={id}>
                                <p>{description}</p>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}
