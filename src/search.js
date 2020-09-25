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
        clearSuggestions();
    };

    return (
        <div id="search">
            <Combobox
                onSelect={async (selected) => {
                    addressSelect(selected);

                    try {
                        const results = await getGeocode({ address: selected });
                        const { lat, lng } = await getLatLng(results[0]);
                        panTo({ lat, lng });
                    } catch (err) {
                        console.log("error in onSelect", err);
                    }
                }}
            >
                <ComboboxInput
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search for the address"
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
        </div>
    );
}
