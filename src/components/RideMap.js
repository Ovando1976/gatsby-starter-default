import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

function RideMap({ pickupCoords, dropoffCoords, driverCoords }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      center={pickupCoords || { lat: 37.7749, lng: -122.4194 }}
      zoom={12}
      mapContainerStyle={{ width: "100%", height: "400px" }}
    >
      {pickupCoords && <Marker position={pickupCoords} label="Pickup" />}
      {dropoffCoords && <Marker position={dropoffCoords} label="Dropoff" />}
      {driverCoords && <Marker position={driverCoords} label="Driver" />}
    </GoogleMap>
  );
}

export default RideMap;