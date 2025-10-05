export async function fetchCoordinates(cityInput) {
  if (!cityInput) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityInput)}&addressdetails=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data || !data[0]) return null;

    const place = data[0];

    // Debug
    console.log("DEBUG place.address:", place.address);

    return {
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
      city: place.address?.city
            || place.address?.town
            || place.address?.village
            || place.address?.municipality
            || cityInput,
      state: place.address?.state
            || place.address?.region
            || place.address?.country
            || "Unknown state",
      country: place.address?.country || "Unknown country"
    };
  } catch (err) {
    console.error("fetchCoordinates error:", err);
    return null;
  }
}
