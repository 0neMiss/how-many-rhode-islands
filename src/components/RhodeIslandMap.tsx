import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './RhodeIslandMap.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface Location {
  lat: number;
  lng: number;
}

const RHODE_ISLAND_LENGTH = 48; // miles

function calculateDistance(point1: Location, point2: Location): number {
  const R = 3963.19; // Earth's radius in miles
  const lat1 = point1.lat * Math.PI / 180;
  const lat2 = point2.lat * Math.PI / 180;
  const dLat = lat2 - lat1;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;
  // The earth is not a perfect sphere, so we need to use the haversine formula to calculate the distance between two points
  // https://en.wikipedia.org/wiki/Haversine_formula
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1) * Math.cos(lat2) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
  // Calculate the "great-circle" distance
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function MapEvents({ onLocationClick }: { onLocationClick: (location: Location) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function RhodeIslandMap() {
  const [locations, setLocations] = useState<Location[]>([]);
  
  const handleMapClick = (location: Location) => {
    if (locations.length < 2) {
      setLocations([...locations, location]);
    } else {
      setLocations([location]);
    }
  };

  const calculateRhodeIslands = () => {
    if (locations.length !== 2) return null;
    const distance = calculateDistance(locations[0], locations[1]);
    return (distance / RHODE_ISLAND_LENGTH).toFixed(2);
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[41.5801, -71.4774]} // Focus the center of Rhode Island
        zoom={8}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // make sure i dont get sued
        />
        <MapEvents onLocationClick={handleMapClick} />
        {locations.map((loc, index) => (
          <Marker key={index} position={[loc.lat, loc.lng]} />
        ))}
      </MapContainer>
      <div className="results">
        {calculateRhodeIslands() && (
          <h2>Distance: {calculateRhodeIslands()} Rhode Islands</h2>
        )}
      </div>

    </div>
  );
} 