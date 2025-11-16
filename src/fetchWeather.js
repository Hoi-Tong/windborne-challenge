// src/fetchWeather.js
export async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m`;
  try {
    const r = await fetch(url);
    const j = await r.json();
    return j;
  } catch (err) {
    console.error("Weather fetch failed", err);
    return null;
  }
}
