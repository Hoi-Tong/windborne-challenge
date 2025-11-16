import React, { useEffect, useState } from "react";
import { fetchLast24 } from "./assets/utils/fetchWindborne";
import MapView from "./assets/components/MapView";
import { fetchWindForPoint } from "./openMeteo";

function App() {
  const [flights, setFlights] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const snapshots = await fetchLast24(); // [{hourAgo, data}]
      const pointsById = {};

      for (const snap of snapshots) {
        console.log(JSON.stringify(snapshots, null, 2));
        const items = snap || [];
        for (const it of items) {
          let lat, lon, alt;

          if (Array.isArray(it)) {
            // WindBorne array format: [lat, lon, altitude?]
            [lat, lon, alt] = it;
          } else {
            // fallback in case some entries are objects
            lat = Number(it.lat || it.latitude);
            lon = Number(it.lon || it.longitude);
            alt = it.alt || it.altitude || 0;
          }

          if (!isFinite(lat) || !isFinite(lon)) continue;

          // Generate a unique ID based on coordinates
          const id = `balloon_${lat.toFixed(2)}_${lon.toFixed(2)}`;
          const ts = new Date().toISOString(); // placeholder timestamp

          pointsById[id] = pointsById[id] || [];
          pointsById[id].push({ lat, lon, ts, alt });
        }
      }

      // Optional: attach wind info (slower, but illustrative)
      const idList = Object.keys(pointsById);
      for (const id of idList) {
        const arr = pointsById[id];
        arr.sort((a, b) => new Date(a.ts) - new Date(b.ts));
        for (const p of arr) {
          try {
            const wind = await fetchWindForPoint(p.lat, p.lon, p.ts);
            p.wind = wind; // { speed, direction }
          } catch (e) {
            p.wind = null;
          }
        }
      }

      // Convert into flights array for MapView
      const flightsArr = Object.entries(pointsById).map(([id, points]) => ({
        id,
        points,
      }));

      if (mounted) setFlights(flightsArr);
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1>WindBorne live constellation — last 24h</h1>
      {flights && flights.length > 0 ? (
        <MapView flights={flights} />
      ) : (
        <div>Status: No balloon data found.</div>
      )}
    </div>
  );
}

export default App;
