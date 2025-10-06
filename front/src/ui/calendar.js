export function initCalendar(){
  const cal = document.getElementById('calendar');
  if (!cal) return;

  const monthYear = document.getElementById('calMonthYear');
  const daysContainer = document.getElementById('calDays');
  const prevBtn = document.getElementById('calPrev');
  const nextBtn = document.getElementById('calNext');

  let viewDate = new Date(); 

  let selectedTs = null;

  function toMidnightTimestamp(y,m,d){
    return new Date(y,m,d,0,0,0,0).getTime();
  }

  function formatDate(ts){
    const d = new Date(ts);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function updateSelectedDate(){
    const payload = selectedTs ? { date: formatDate(selectedTs) } : { date: null };
    try {
      document.dispatchEvent(new CustomEvent('calendarDateChanged', { detail: payload }));
    } catch (e) {
    }
  }

  function highlightSelected(){
    const buttons = daysContainer.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.classList.remove('selected');
      const ts = Number(btn.dataset.time || 0);
      if (!ts) return;
      if (selectedTs && ts === selectedTs) btn.classList.add('selected');
    });
  }

  function render(){
    daysContainer.innerHTML = '';
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    monthYear.textContent = viewDate.toLocaleString('us-EN',{ month: 'long', year: 'numeric' });

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay();
    const totalDays = last.getDate();

    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const tomorrowTs = tomorrow.getTime();

    if (selectedTs && selectedTs < tomorrowTs) {
      selectedTs = null;
      updateSelectedDate();
    }

    for (let i=0;i<startDay;i++){
      const btn = document.createElement('button');
      btn.className = 'inactive';
      btn.disabled = true;
      daysContainer.appendChild(btn);
    }

    for (let d=1; d<=totalDays; d++){
      const btn = document.createElement('button');
      btn.textContent = String(d);
      const ts = toMidnightTimestamp(year, month, d);
      btn.dataset.time = String(ts);

      const isToday = (ts === toMidnightTimestamp(now.getFullYear(), now.getMonth(), now.getDate()));
      if (isToday) btn.classList.add('today');

      if (ts < tomorrowTs) {
        btn.classList.add('inactive');
        btn.disabled = true;
      }

      btn.addEventListener('click', ()=>{
        if (btn.disabled) return;

        if (selectedTs === ts){
          selectedTs = null;
        } else {
          selectedTs = ts;
        }
        highlightSelected();
        updateSelectedDate();
      });

      daysContainer.appendChild(btn);
    }

    const minYear = tomorrow.getFullYear();
    const minMonth = tomorrow.getMonth();
    if (year < minYear || (year === minYear && month < minMonth)) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
    }
    highlightSelected();
  }

  prevBtn.addEventListener('click', ()=>{
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0,0,0,0);
    const target = new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1);
    const lastOfTarget = new Date(target.getFullYear(), target.getMonth() + 1, 0, 0,0,0,0);
    if (lastOfTarget.getTime() < tomorrow.getTime()) return;

    viewDate = target;
    render();
  });

  nextBtn.addEventListener('click', ()=>{
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1);
    render();
  });

  render();
};