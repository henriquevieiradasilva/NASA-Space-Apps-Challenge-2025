export function initCalendar() {
  const calendar = document.getElementById('calendar');
  if (!calendar) return;

  const monthYearLabel = document.getElementById('calMonthYear');
  const daysContainer = document.getElementById('calDays');
  const prevButton = document.getElementById('calPrev');
  const nextButton = document.getElementById('calNext');

  let currentViewDate = new Date();
  let selectedTimestamp = null;

  function toMidnightTimestamp(year, month, day) {
    return new Date(year, month, day, 0, 0, 0, 0).getTime();
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function updateSelectedDate() {
    const payload = selectedTimestamp ? { date: formatDate(selectedTimestamp) } : { date: null };
    try {
      document.dispatchEvent(new CustomEvent('calendarDateChanged', { detail: payload }));
    } catch (e) {
      // silently fail
    }
  }

  function highlightSelectedDate() {
    const buttons = daysContainer.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.classList.remove('selected');
      const ts = Number(btn.dataset.time || 0);
      if (!ts) return;
      if (selectedTimestamp && ts === selectedTimestamp) btn.classList.add('selected');
    });
  }

  function renderCalendar() {
    daysContainer.innerHTML = '';
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    monthYearLabel.textContent = currentViewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const tomorrowTimestamp = tomorrow.getTime();

    if (selectedTimestamp && selectedTimestamp < tomorrowTimestamp) {
      selectedTimestamp = null;
      updateSelectedDate();
    }

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startDay; i++) {
      const btn = document.createElement('button');
      btn.className = 'inactive';
      btn.disabled = true;
      daysContainer.appendChild(btn);
    }

    // Add day buttons
    for (let day = 1; day <= totalDays; day++) {
      const btn = document.createElement('button');
      btn.textContent = String(day);
      const ts = toMidnightTimestamp(year, month, day);
      btn.dataset.time = String(ts);

      const isToday = ts === toMidnightTimestamp(now.getFullYear(), now.getMonth(), now.getDate());
      if (isToday) btn.classList.add('today');

      if (ts < tomorrowTimestamp) {
        btn.classList.add('inactive');
        btn.disabled = true;
      }

      btn.addEventListener('click', () => {
        if (btn.disabled) return;

        selectedTimestamp = selectedTimestamp === ts ? null : ts;
        highlightSelectedDate();
        updateSelectedDate();
      });

      daysContainer.appendChild(btn);
    }

    // Disable previous month button if it's before tomorrow
    const minYear = tomorrow.getFullYear();
    const minMonth = tomorrow.getMonth();
    prevButton.disabled = year < minYear || (year === minYear && month < minMonth);

    highlightSelectedDate();
  }

  prevButton.addEventListener('click', () => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const targetDate = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1, 1);
    const lastOfTarget = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 0, 0, 0, 0);
    if (lastOfTarget.getTime() < tomorrow.getTime()) return;

    currentViewDate = targetDate;
    renderCalendar();
  });

  nextButton.addEventListener('click', () => {
    currentViewDate = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  renderCalendar();
};
