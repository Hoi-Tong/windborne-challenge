// src/utils/fetchWindborne.js
export async function fetchLast24() {
  const results = [];

  for (let i = 0; i < 24; i++) {
    const label = String(i).padStart(2, "0");
    const url = `https://a.windbornesystems.com/treasure/${label}.json`;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) continue;

      const data = await res.json(); // returns an array of arrays
      if (Array.isArray(data)) {
        // flatten all points into results
        data.forEach((point) => {
          if (Array.isArray(point) && point.length >= 2) {
            const lat = Number(point[0]);
            const lon = Number(point[1]);
            if (isFinite(lat) && isFinite(lon)) results.push([lat, lon]);
          }
        });
      }
    } catch (err) {
      console.warn("Failed to fetch", url, err);
    }
  }

  return results; // flat array of [lat, lon]
}
