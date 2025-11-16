import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchLast24 } from "../utils/fetchWindborne";

// Fix Leaflet icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function MapView() {
  const [points, setPoints] = useState([]);
  const [status, setStatus] = useState("Loading…");

  useEffect(() => {
    async function load() {
      setStatus("Fetching WindBorne data…");
      const pts = await fetchLast24();
      if (!pts.length) setStatus("No balloon points found.");
      else {
        setPoints(pts);
        setStatus(`Loaded ${pts.length} points.`);
      }
    }
    load();
  }, []);

  const center = points.length ? points[0] : [0, 0];

  return (
    <div style={{ padding: "20px", height: "600px", width: "100%" }}>
      <h2>WindBorne Balloon Positions (24h)</h2>
      <p><strong>Status:</strong> {status}</p>

      <MapContainer center={center} zoom={2} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {points.length > 0 && (
          <>
            <Polyline positions={points} color="blue" />
            {points.map((pos, i) => (
              <Marker position={pos} key={i}>
                <Popup>{`Lat: ${pos[0].toFixed(4)}, Lon: ${pos[1].toFixed(4)}`}</Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
}
