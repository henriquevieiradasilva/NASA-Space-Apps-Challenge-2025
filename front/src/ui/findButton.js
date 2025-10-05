import { showResultsPanel, populateResults, setLoading } from "./resultsPanel.js";

export function initFindButton() {
  const findBtn = document.getElementById("findBtn");
  if (!findBtn) return;

  findBtn.addEventListener("click", async () => {
    // pega a data selecionada no calendário
    const selected = window.calendarDate?.date;
    if (!selected) {
      alert("Please select a date from the calendar!");
      return;
    }

    // coordenadas fictícias por enquanto
    const lat = -23.5;
    const lon = -46.6;

    // mostra painel e indica loading
    setLoading(true);
    showResultsPanel();

    // monta URL da API
    const url = `http://127.0.0.1:5000/prever?data=${encodeURIComponent(selected)}&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    
    console.log("Fetching forecast for:", selected);
    console.log("API URL:", url);

    try {
      // fetch sem cache
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // adiciona nome e coordenadas fictícias
      const result = {
        data: json.data,
        lat: lat,
        lon: lon,
        previsao: json.previsao, // <-- aqui usamos o valor real da API
        locationName: "Jundiaí - São Paulo (test)"
      };

      populateResults(result);

    } catch (err) {
      console.warn("API request failed, using fallback.", err);

      // fallback completo (tudo fictício)
      populateResults({
        data: selected,
        lat,
        lon,
        previsao: 19.4, // fallback se API falhar
        locationName: "Jundiaí - São Paulo (fallback)"
      });
    }
  });
}
