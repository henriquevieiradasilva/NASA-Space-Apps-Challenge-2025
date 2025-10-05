// resultsPanel.js

// Mostra / esconde o painel (animação via CSS)
export function showResultsPanel() {
  const panel = document.getElementById("resultsPanel");
  if (!panel) return;
  panel.classList.add("visible");
}

export function hideResultsPanel() {
  const panel = document.getElementById("resultsPanel");
  if (!panel) return;
  panel.classList.remove("visible");
}

// Inicializa o painel (botão de fechar)
export function initResultsPanel() {
  const panel = document.getElementById("resultsPanel");
  if (!panel) return;

  const closeBtn = document.getElementById("closeResultsBtn") || panel.querySelector(".close-results");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      hideResultsPanel();
    });
  }
}

// Marca o painel como carregando (opcional: atualiza textos para indicar loading)
export function setLoading(isLoading = true) {
  const loc = document.getElementById("locationName");
  const latlon = document.getElementById("latLon");
  const dateTime = document.getElementById("dateTime");
  const k = document.getElementById("tempK");
  const c = document.getElementById("tempC");
  const f = document.getElementById("tempF");

  if (!loc || !latlon || !dateTime || !k || !c || !f) return;

  if (isLoading) {
    loc.textContent = "Loading...";
    latlon.textContent = "-- | --";
    dateTime.textContent = "--/--/----";
    k.textContent = "-- K";
    c.textContent = "-- ºC";
    f.textContent = "-- ºF";
  }
}

// Popula o painel com os dados retornados da API (espera objeto { data, lat, lon, previsao, locationName? })
export function populateResults(resp = {}) {
  // assumimos que resp.previsao está em °C (ajuste se for outro)
  const locationName = resp.locationName || "Local fictício";
  const dateStr = resp.data || "2025-12-25";
  const lat = (typeof resp.lat !== "undefined") ? resp.lat : 0;
  const lon = (typeof resp.lon !== "undefined") ? resp.lon : 0;
  const previsao = (typeof resp.previsao !== "undefined") ? Number(resp.previsao) : null;

  // conversões
  const celsius = (previsao !== null) ? previsao : null;
  const kelvin = (celsius !== null) ? (celsius + 273.15) : null;
  const fahrenheit = (celsius !== null) ? (celsius * 9/5 + 32) : null;

  const loc = document.getElementById("locationName");
  const latlon = document.getElementById("latLon");
  const dateTime = document.getElementById("dateTime");
  const k = document.getElementById("tempK");
  const c = document.getElementById("tempC");
  const f = document.getElementById("tempF");

  if (loc) loc.textContent = locationName;
  if (latlon) latlon.textContent = `${lat} | ${lon}`;
  if (dateTime) dateTime.textContent = `${formatDate(dateStr)}`; // sem hora no JSON exemplo
  if (k) k.textContent = kelvin !== null ? `${round(kelvin, 2)} K` : "-- K";
  if (c) c.textContent = celsius !== null ? `${round(celsius, 2)} ºC` : "-- ºC";
  if (f) f.textContent = fahrenheit !== null ? `${round(fahrenheit, 2)} ºF` : "-- ºF";
}

// helpers
function round(v, dec = 2) {
  return Math.round((v + Number.EPSILON) * Math.pow(10, dec)) / Math.pow(10, dec);
}

function formatDate(dateISO) {
  try {
    // dateISO no formato "YYYY-MM-DD"
    const parts = dateISO.split("-");
    if (parts.length !== 3) return dateISO;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    // cria Date local
    const d = new Date(year, month - 1, day);
    const dayStr = String(d.getDate()).padStart(2, "0");
    const monthStr = String(d.getMonth() + 1).padStart(2, "0");
    const yearStr = d.getFullYear();
    return `${dayStr}/${monthStr}/${yearStr}`;
  } catch (e) {
    return dateISO;
  }
}
