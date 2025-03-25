import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icons directly in the component
const createCustomIcon = () => {
  return L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const LocateControl = ({ onLocationFound }: { onLocationFound: (latlng: L.LatLng) => void }) => {
  const map = useMap();

  useEffect(() => {
    const locateButton = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-locate');
    locateButton.innerHTML = `
      <span class="leaflet-control-locate-icon" title="Locate me">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M12 8a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0-2a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6z"/>
        </svg>
      </span>
    `;

    L.DomEvent.on(locateButton, 'click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      map.locate({
        setView: true,
        maxZoom: 16,
        enableHighAccuracy: true
      });
    });

    const locateControl = L.control({ position: 'topleft' });
    locateControl.onAdd = () => locateButton;
    locateControl.addTo(map);

    map.on('locationfound', (e) => {
      onLocationFound(e.latlng);
      L.circle(e.latlng, {
        radius: e.accuracy,
        fillOpacity: 0.2,
        color: '#136AEC'
      }).addTo(map);
    });

    return () => {
      map.off('locationfound');
      map.removeControl(locateControl);
    };
  }, [map, onLocationFound]);

  return null;
};

const NearMePage = () => {
  const mapRef = useRef<L.Map>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Create icon instance once
  const customIcon = createCustomIcon();

  const handleLocationFound = (latlng: L.LatLng) => {
    setUserLocation([latlng.lat, latlng.lng]);
    setLoading(false);
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserLocation([latitude, longitude]);
          setAccuracy(accuracy);
          setLoading(false);
          mapRef.current?.flyTo([latitude, longitude], 15);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError(`Location error: ${error.message}`);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Find Nearby Hotels</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error} - Showing default location
        </div>
      )}
      
      {!loading ? (
        <MapContainer
          center={userLocation || [51.505, -0.09]}
          zoom={13}
          style={{ height: "500px", width: "100%", borderRadius: "0.5rem" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {userLocation && (
            <Marker position={userLocation} icon={customIcon}>
              <Popup>
                <div className="font-semibold">Your Location</div>
                <div>Lat: {userLocation[0].toFixed(4)}</div>
                <div>Lng: {userLocation[1].toFixed(4)}</div>
                {accuracy && <div>Accuracy: {Math.round(accuracy)} meters</div>}
              </Popup>
            </Marker>
          )}
          <LocateControl onLocationFound={handleLocationFound} />
        </MapContainer>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default NearMePage;