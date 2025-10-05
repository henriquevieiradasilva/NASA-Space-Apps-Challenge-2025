import { showResultsPanel, populateResults, setLoading } from "./resultsPanel.js";
import { locationSearch } from "./searchBar.js";
import { getDate } from "../../stateManager.js";

export function initFindButton() {
  const searchBar = document.getElementById("searchBar");
  const findBtn = document.getElementById("findBtn");
  if (!findBtn) return;

  findBtn.addEventListener("click", () => {
    const searchInput = searchBar.value;
    const selectedDate = getDate();

    const dateStr = typeof selectedDate === "object"
      ? (selectedDate.date || selectedDate.value || JSON.stringify(selectedDate))
      : selectedDate;

    if (!dateStr || !searchInput) {
      alert("Please select a date from the calendar!");
      return;
    }

    locationSearch(searchInput);

    document.addEventListener(
      "locationFound",
      async (e) => {
        const { lat, lon, displayName } = e.detail;
        const locationName = `${displayName.city}, ${displayName.state}, ${displayName.country}`;

        setLoading(true);
        showResultsPanel();

        const payload = { data: dateStr, lat, lon };

        try {
          const res = await fetch("http://127.0.0.1:5000/prever", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            cache: "no-store"
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();

          const result = {
            locationName,
            date: dateStr,
            lat,
            lon,
            temperatura: json.temperatura,
            precipitacao: json.precipitacao,
            umidade: json.umidade,
            vento: json.vento
          };

          populateResults(result);

        } catch (err) {
          console.warn("API request failed, using fallback.", err);
          populateResults({
            lat,
            lon,
            temperatura: 19.4,
            locationName,
            date: dateStr
          });
        }
      },
      { once: true }
    );
  });
}
