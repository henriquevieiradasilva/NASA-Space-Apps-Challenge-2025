import { fetchCoordinates } from '../api/cityApi.js';

export async function locationSearch(cityInput) {
  const coords = await fetchCoordinates(cityInput);

  if (coords) {
    const payload = {
      lat: coords.lat,
      lon: coords.lon,
      displayName: {
        city: coords.city,
        state: coords.state,
        country: coords.country
      }
    };
    document.dispatchEvent(new CustomEvent("locationFound", { detail: payload }));
  } else {
    alert(`City "${cityInput}" not found.`);
  }
}
