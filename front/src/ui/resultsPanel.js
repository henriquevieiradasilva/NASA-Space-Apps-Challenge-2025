// resultsPanel.js

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

export function setLoading(isLoading = true) {
  const loc = document.getElementById("locationName");
  const latlon = document.getElementById("latLon");
  const dateTime = document.getElementById("dateTime");
  const c = document.getElementById("tempC");
  const f = document.getElementById("tempF");
  const p = document.getElementById("precipitacao");
  const u = document.getElementById("umidade");
  const v = document.getElementById("vento");

  if (isLoading) {
    if (loc) loc.textContent = "Loading...";
    if (latlon) latlon.textContent = "-- | --";
    if (dateTime) dateTime.textContent = "--/--/----";
    if (c) c.textContent = "-- ºC";
    if (f) f.textContent = "-- ºF";
    if (p) p.textContent = "Precipitation: -- mm";
    if (u) u.textContent = "Humidity: -- %";
    if (v) v.textContent = "Wind: -- m/s";
  }
}

export function populateResults(resp = {}) {
  const locationName = resp.locationName || "Unknown Location";
  const dateStr = resp.date || "----/--/--";
  const lat = typeof resp.lat !== "undefined" ? resp.lat : 0;
  const lon = typeof resp.lon !== "undefined" ? resp.lon : 0;

  // Temperatura
  const celsius = typeof resp.temperatura !== "undefined" ? Number(resp.temperatura) : null;
  const fahrenheit = celsius !== null ? celsius * 9/5 + 32 : null;

  // Precipitação, umidade, vento
  const precipitacao = typeof resp.precipitacao !== "undefined" ? Number(resp.precipitacao) : null;
  const umidade = typeof resp.umidade !== "undefined" ? Number(resp.umidade) : null;
  const vento = typeof resp.vento !== "undefined" ? Number(resp.vento) : null;

  const loc = document.getElementById("locationName");
  const latlon = document.getElementById("latLon");
  const dateTime = document.getElementById("dateTime");
  const c = document.getElementById("tempC");
  const f = document.getElementById("tempF");
  const p = document.getElementById("precipitacao");
  const u = document.getElementById("umidade");
  const v = document.getElementById("vento");

  if (loc) loc.textContent = locationName;
  if (latlon) latlon.textContent = `${lat} | ${lon}`;
  if (dateTime) dateTime.textContent = formatDate(dateStr);

  if (c) c.textContent = celsius !== null ? `${round(celsius, 2)} ºC` : "-- ºC";
  if (f) f.textContent = fahrenheit !== null ? `${round(fahrenheit, 2)} ºF` : "-- ºF";

  if (p) p.textContent = precipitacao !== null ? ` ${round(precipitacao, 2)} mm` : "-- mm";
  if (u) u.textContent = umidade !== null ? `${round(umidade, 2)} %` : "-- %";
  if (v) v.textContent = vento !== null ? `${round(vento, 2)} m/s` : "-- m/s";
}

// Função de arredondamento
function round(v, dec = 2) {
  return Math.round((v + Number.EPSILON) * Math.pow(10, dec)) / Math.pow(10, dec);
}

// Formata data no padrão MM/DD/YYYY
function formatDate(dateISO) {
  try {
    const parts = dateISO.split("-");
    if (parts.length !== 3) return dateISO;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month - 1, day);
    const dayStr = String(d.getDate()).padStart(2, "0");
    const monthStr = String(d.getMonth() + 1).padStart(2, "0");
    const yearStr = d.getFullYear();
    return `${monthStr}/${dayStr}/${yearStr}`;
  } catch (e) {
    return dateISO;
  }
}

// ✅ Inicialização do painel
export function initResultsPanel() {
  const panel = document.getElementById("resultsPanel");
  if (!panel) return;

  // Fechar painel
  const closeBtn = document.getElementById("closeResultsBtn") || panel.querySelector(".close-results");
  if (closeBtn) closeBtn.addEventListener("click", () => hideResultsPanel());

  // Alternar temperatura
  const prevBtn = document.getElementById('prev-temp');
  const nextBtn = document.getElementById('next-temp');
  const tempC = document.getElementById('tempC');
  const tempF = document.getElementById('tempF');

  function showCelsius() {
    tempC.classList.add('active');
    tempF.classList.remove('active');
  }

  function showFahrenheit() {
    tempF.classList.add('active');
    tempC.classList.remove('active');
  }

  if (prevBtn) prevBtn.addEventListener('click', showCelsius);
  if (nextBtn) nextBtn.addEventListener('click', showFahrenheit);

  // Alternar info adicional
  const infoButtons = panel.querySelectorAll('.info-menu button');
  infoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.infoTarget + '-info';
      panel.querySelectorAll('.result-section.additional p').forEach(p => {
        if (p.id === targetId) p.classList.toggle('hidden');
        else p.classList.add('hidden');
      });
    });
  });
}
