/* --- simple calendar widget --- */
export function initCalendar(){
	const cal = document.getElementById('calendar');
	if (!cal) return;

	const monthYear = document.getElementById('calMonthYear');
	const daysContainer = document.getElementById('calDays');
	const prevBtn = document.getElementById('calPrev');
	const nextBtn = document.getElementById('calNext');

	let viewDate = new Date(); // current shown month

	// range selection state (timestamps at midnight local)
	let rangeStart = null;
	let rangeEnd = null;


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

	// save selection to a global variable instead of writing to the search input
	function updateGlobalRange(){
		// window.calendarRange will be { start: 'YYYY-MM-DD' | null, end: 'YYYY-MM-DD' | null, startTs, endTs }
		const payload = {
			start: rangeStart ? formatDate(rangeStart) : null,
			end: rangeEnd ? formatDate(rangeEnd) : null,
			startTs: rangeStart || null,
			endTs: rangeEnd || null,
		};
		try {
			window.calendarRange = payload;
		} catch (e) {
			// ignore if environment doesn't allow window write
		}
		// also dispatch a custom event so app code can react
		const ev = new CustomEvent('calendarRangeChanged', { detail: payload });
		document.dispatchEvent(ev);
	}

	function highlightRange(){
		const buttons = daysContainer.querySelectorAll('button');
		buttons.forEach(btn => {
			btn.classList.remove('in-range','range-start','range-end');
			const ts = Number(btn.dataset.time || 0);
			if (!ts) return;
			if (rangeStart && rangeEnd){
				if (ts >= rangeStart && ts <= rangeEnd) btn.classList.add('in-range');
				if (ts === rangeStart) btn.classList.add('range-start');
				if (ts === rangeEnd) btn.classList.add('range-end');
			} else if (rangeStart){
				if (ts === rangeStart) btn.classList.add('range-start');
			}
		});
	}

	function render(){
		daysContainer.innerHTML = '';
		const year = viewDate.getFullYear();
		const month = viewDate.getMonth();
		monthYear.textContent = viewDate.toLocaleString('pt-BR',{ month: 'long', year: 'numeric' });

		const first = new Date(year, month, 1);
		const last = new Date(year, month + 1, 0);
		const startDay = first.getDay();
		const totalDays = last.getDate();

		// fill blanks for previous month's tail
		for (let i=0;i<startDay;i++){
			const btn = document.createElement('button');
			btn.className = 'inactive';
			btn.disabled = true;
			daysContainer.appendChild(btn);
		}

		const today = new Date();
		for (let d=1; d<=totalDays; d++){
			const btn = document.createElement('button');
			btn.textContent = String(d);
			const ts = toMidnightTimestamp(year, month, d);
			btn.dataset.time = String(ts);
			const isToday = (ts === toMidnightTimestamp(today.getFullYear(), today.getMonth(), today.getDate()));
			if (isToday) btn.classList.add('today');

			btn.addEventListener('click', ()=>{
				// range selection logic
				if (!rangeStart){
					rangeStart = ts;
					rangeEnd = null;
				} else if (!rangeEnd){
					if (ts < rangeStart){
						// clicked before start -> swap
						rangeEnd = rangeStart;
						rangeStart = ts;
					} else if (ts === rangeStart){
						// clicked same day -> clear end
						rangeEnd = null;
					} else {
						rangeEnd = ts;
					}
				} else {
					// both set -> start new selection from this day
					rangeStart = ts;
					rangeEnd = null;
				}
				highlightRange();
				updateGlobalRange();
				// for demo: log selection
				console.log('range', rangeStart ? formatDate(rangeStart) : null, rangeEnd ? formatDate(rangeEnd) : null);
			});
			daysContainer.appendChild(btn);
		}

		// after rendering, apply highlight if needed
		highlightRange();
	}

	prevBtn.addEventListener('click', ()=>{ viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1); render(); });
	nextBtn.addEventListener('click', ()=>{ viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1); render(); });

	render();
};