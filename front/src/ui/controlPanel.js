
export function showControlPanel({ revealSearch = true, revealCalendar = true } = {}) {
  const panel = document.getElementById('controlPanel');
  if (!panel) return;

  // garante que estejamos começando do estado oculto
  panel.classList.remove('hidden-instant');

  // força reflow para garantir que a transição funcione mesmo se a classe for reaplicada
  panel.offsetHeight;

  // mostra o painel (dispara transição CSS)
  panel.classList.add('panel-visible');
}

export function hideControlPanel({ instant = false } = {}) {
  const panel = document.getElementById('controlPanel');
  if (!panel) return;

  // remove classes de filhos
  const search = document.getElementById('searchBar');
  if (search) search.classList.remove('search-visible');

  const cal = document.getElementById('calendar');
  if (cal) cal.classList.remove('calendar-visible');

  // oculta painel com animação
  panel.classList.remove('panel-visible');

  if (instant) {
    // força ocultação imediata (sem animação)
    panel.classList.add('hidden-instant');
  }
}