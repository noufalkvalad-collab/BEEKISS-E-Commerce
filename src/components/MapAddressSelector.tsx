"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import { Loader2, Search, MapPin } from "lucide-react";

interface MapAddressSelectorProps {
    onAddressSelect: (addressData: {
        houseName: string;
        district: string;
        state: string;
        pincode: string;
        landmark: string;
    }) => void;
}

const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "1rem",
};

const center = {
    lat: 10.8505, // Default center (Kerala)
    lng: 76.2711,
};

const libraries: ("places")[] = ["places"];

export default function MapAddressSelector({ onAddressSelect }: MapAddressSelectorProps) {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markerPos, setMarkerPos] = useState(center);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<string>("");

    const onLoad = useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Auto-locate on mount
    useEffect(() => {
        if (isLoaded) {
            getCurrentLocation();
        }
    }, [isLoaded]);

    const extractAddressComponents = (place: google.maps.places.PlaceResult | any) => {
        let houseName = "";
        let district = "";
        let state = "";
        let pincode = "";
        let landmark = "";

        if (place.address_components) {
            for (const component of place.address_components) {
                const types = component.types;
                
                // Pincode
                if (types.includes("postal_code")) {
                    pincode = component.long_name;
                }
                
                // State
                if (types.includes("administrative_area_level_1")) {
                    state = component.long_name;
                }

                // District / City
                if (types.includes("administrative_area_level_2")) {
                    district = component.long_name;
                } else if (!district && (types.includes("administrative_area_level_3") || types.includes("locality"))) {
                    district = component.long_name;
                }

                // House Name / Street / Route
                if (types.includes("premise") || types.includes("street_number") || types.includes("route") || types.includes("sublocality_level_2")) {
                    houseName += (houseName ? ", " : "") + component.long_name;
                }

                // Landmark / Area
                if (types.includes("sublocality_level_1") || types.includes("neighborhood") || types.includes("point_of_interest")) {
                    landmark = component.long_name;
                }
            }
        }

        // Final fallback for District if still empty
        if (!district && place.formatted_address) {
            const parts = place.formatted_address.split(",");
            if (parts.length >= 3) {
                district = parts[parts.length - 3].trim();
            }
        }

        // If houseName is still empty, use the name of the place
        if (!houseName && place.name && !place.name.includes("°")) {
            houseName = place.name;
        }

        setCurrentAddress(place.formatted_address || `${houseName}, ${district}`);
        
        console.log("Extracted Map Data:", { houseName, district, state, pincode, landmark });
        
        onAddressSelect({ 
            houseName: houseName || "", 
            district: district || "", 
            state: state || "", 
            pincode: pincode || "", 
            landmark: landmark || "" 
        });
    };

    const reverseGeocode = (lat: number, lng: number) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.[0]) {
                extractAddressComponents(results[0]);
            }
        });
    };

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry?.location) {
                const newPos = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };
                setMarkerPos(newPos);
                map?.panTo(newPos);
                extractAddressComponents(place);
            }
        }
    };

    const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newPos = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            };
            setMarkerPos(newPos);
            reverseGeocode(newPos.lat, newPos.lng);
        }
    };

    const getCurrentLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setMarkerPos(newPos);
                    if (map) {
                        map.panTo(newPos);
                    } else {
                        // Fallback if map isn't ready yet
                        setMarkerPos(newPos);
                    }
                    reverseGeocode(newPos.lat, newPos.lng);
                    setIsLocating(false);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setIsLocating(false);
                }
            );
        } else {
            setIsLocating(false);
        }
    };

    if (!isLoaded) return (
        <div className="w-full h-[300px] bg-gray-100 rounded-2xl flex items-center justify-center border border-dashed border-gray-300">
            <Loader2 className="w-6 h-6 animate-spin text-[#D4A017]" />
        </div>
    );

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                Google Maps API Key is missing. Please add it to your environment variables.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Autocomplete
                    onLoad={setAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                >
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for your location..."
                            className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] text-sm shadow-sm"
                        />
                        <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    </div>
                </Autocomplete>
            </div>

            <div className="relative group overflow-hidden rounded-2xl border border-gray-200 shadow-inner">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={markerPos}
                    zoom={15}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        zoomControl: false,
                    }}
                >
                    <Marker
                        position={markerPos}
                        draggable={true}
                        onDragEnd={onMarkerDragEnd}
                    />
                </GoogleMap>
                
                {/* Action Buttons in Bottom Left */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isLocating}
                        className="bg-white p-3 rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 text-xs font-bold text-[#0F2E1D]"
                        title="Use my current location"
                    >
                        {isLocating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <MapPin className="w-4 h-4" />
                        )}
                        <span>LOCATE ME</span>
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => reverseGeocode(markerPos.lat, markerPos.lng)}
                        className="bg-[#0F2E1D] p-3 rounded-xl shadow-lg border border-[#0F2E1D] hover:bg-[#163b22] transition-all active:scale-95 text-[#D4A017] text-xs font-bold"
                    >
                        CONFIRM LOCATION
                    </button>
                </div>
            </div>
            {currentAddress && (
                <div className="p-3 bg-[#FDFDF9] border border-[#D4A017]/20 rounded-xl animate-in fade-in duration-500">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Detected Address</p>
                    <p className="text-sm font-medium text-[#0F2E1D] line-clamp-1">{currentAddress}</p>
                </div>
            )}
            <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center">Drag marker to refine your location</p>
        </div>
    );
}
