import React from "react";

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
} from "@reach/combobox";

export default function SearchBox(props) {
    let { panTo } = props;
    const {
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

    const addressSelect = (address) => {
        setValue(address, false);
        // console.log("address :", address);

        clearSuggestions();
    };

    // console.log("data", data);
    // console.log("status", status);

    return (
        <>
            <Combobox
                onSelect={async (selected) => {
                    addressSelect(selected);
                    // console.log(selected);
                    try {
                        const results = await getGeocode({ address: selected });
                        // console.log("selected", selected);
                        const { lat, lng } = await getLatLng(results[0]);
                        // console.log(lat, lng);
                        panTo({ lat, lng });
                    } catch (err) {
                        console.log("error in onSelect", err);
                    }
                }}
            >
                <ComboboxInput
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter the address"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status == "OK" &&
                            data.map(({ description, id }) => (
                                <ComboboxOption key={id} value={description} />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
            {/* <div>
                <input
                    value={value}
                    type="search"
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
            </div> */}
        </>
    );
}
