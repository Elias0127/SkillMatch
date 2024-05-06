import React, { useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

const googleMapsLoader = new Loader({
  apiKey: "AIzaSyBh29fiEPcC0fDjFHKS7AZi1zFYHjSnQoE", 
  libraries: ["places"]
});

const LocationInput = ({ onLocationSelect }) => {
  const [address, setAddress] = useState("");

  const handleGeocode = async () => {
    if (address.trim() === "") return;

    try {
      const google = await googleMapsLoader.load();
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          onLocationSelect({
            address,
            coordinates: {
              lat: location.lat(),
              lng: location.lng()
            }
          });
        } else {
          alert("Geocoding failed: " + status);
        }
      });
    } catch (error) {
      console.error("Error during geocoding:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={address}
        onChange={e => setAddress(e.target.value)}
        placeholder="Enter your address"
      />
      <button onClick={handleGeocode}>Locate</button>
    </div>
  );
};

export default LocationInput;
