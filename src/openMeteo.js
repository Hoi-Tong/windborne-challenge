export async function fetchWindForPoint(lat, lon, timestamp) {
  // Trim timestamp to just YYYY-MM-DD
  const date = timestamp.slice(0, 10);

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=windspeed_10m,winddirection_10m&start_date=${date}&end_date=${date}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.hourly) return null;

  // Pick nearest hour to the timestamp
  let nearestIndex = 0;
  const target = new Date(timestamp);
  const hours = data.hourly.time;

  for (let i = 0; i < hours.length; i++) {
    const diff = Math.abs(new Date(hours[i]) - target);
    const best = Math.abs(new Date(hours[nearestIndex]) - target);
    if (diff < best) nearestIndex = i;
  }

  return {
    speed: data.hourly.windspeed_10m?.[nearestIndex] ?? null,
    direction: data.hourly.winddirection_10m?.[nearestIndex] ?? null
  };
}
