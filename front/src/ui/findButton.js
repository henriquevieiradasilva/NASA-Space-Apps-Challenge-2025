import { showResultsPanel, populateResults, setLoading } from "./resultsPanel.js";
import { locationSearch } from "./searchBar.js";
import { getDate } from "../../stateManager.js";
import { showCustomAlert } from "./customAlert.js"; 

let currentController = null;
let lastSearch = { term: null, date: null };

export function initFindButton({ focusOnMarker } = {}) {
  const searchBar = document.getElementById("searchBar");
  const findBtn = document.getElementById("findBtn");
  if (!findBtn) return;

  findBtn.addEventListener("click", () => {
    let searchInput = searchBar.value.trim();
    const selectedDate = getDate();

    const dateStr = typeof selectedDate === "object"
      ? (selectedDate.date || selectedDate.value || "").trim()
      : (selectedDate || "").trim();

    if (!dateStr && !searchInput) {
      showCustomAlert("Please, select the date and the city");
      return;
    }
    if (!dateStr) {
      showCustomAlert("Please select the date on calendar");
      return;
    }
    if (!searchInput) {
      showCustomAlert("Please, write the city on search bar");
      return;
    }

    if (lastSearch.term === searchInput && lastSearch.date === dateStr) {
      return;
    }
    lastSearch = { term: searchInput, date: dateStr };

    locationSearch(searchInput);

    document.addEventListener(
      "locationFound",
      async (e) => {
        const { lat, lon, displayName } = e.detail;
        const locationName = `${displayName.city}, ${displayName.state}, ${displayName.country}`;

        if (currentController) currentController.abort();
        currentController = new AbortController();
        const { signal } = currentController;

        setLoading(true);
        showResultsPanel();

        if (typeof focusOnMarker === "function") {
          try { focusOnMarker(); } catch (err) { console.warn("focusOnMarker failed:", err); }
        }

        const payload = { data: dateStr, lat, lon };

        try {
          const res = await fetch("http://127.0.0.1:5000/prever", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            cache: "no-store",
            signal
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();

          if (signal.aborted) return;

          populateResults({
            locationName,
            date: dateStr,
            lat,
            lon,
            temperatura: json.temperatura,
            precipitacao: json.precipitacao,
            umidade: json.umidade,
            vento: json.vento
          });

        } catch (err) {
          if (err.name === "AbortError") return;
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