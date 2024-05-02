import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function MapComponent() {
    const [currentLocation, setCurrentLocation] = useState({ lat: -34.397, lng: 150.644 }); // Default coordinates

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    alert('Location access denied. Using default location.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }, []);

    const containerStyle = {
        width: '400px',
        height: '400px'
    };

    const handleLocationSelect = (selectedLocation) => {
        if (props.onLocationSelect) {
          props.onLocationSelect(selectedLocation);
        }
      };

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyDI6DTTn9wsQZb-HqCAbU0Ehxbms_YfvYs">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentLocation}
                zoom={10}
            >
                {/* Marker for Current Location */}
                <Marker position={currentLocation} />
            </GoogleMap>
        </LoadScript>
    );
}

export default MapComponent;
