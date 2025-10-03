/* --- simple calendar widget --- */
export function initCalendar(){
	const cal = document.getElementById('calendar');
	if (!cal) return;

	const monthYear = document.getElementById('calMonthYear');
	const daysContainer = document.getElementById('calDays');
	const prevBtn = document.getElementById('calPrev');
	const nextBtn = document.getElementById('calNext');

	let viewDate = new Date(); // current shown month

	// single-day selection state (timestamp at midnight local)
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
		const payload = selectedTs ? {
			date: formatDate(selectedTs),
			ts: selectedTs,
		} : {
			date: null,
			ts: null,
		};
		try {
			window.calendarDate = payload;
		} catch (e) {
			// ignore if environment doesn't allow window write
		}
		document.dispatchEvent(new CustomEvent('calendarDateChanged', { detail: payload }));
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
				if (selectedTs === ts){
					selectedTs = null;
				} else {
					selectedTs = ts;
				}
				highlightSelected();
				updateSelectedDate();
				// for demo: log selection
				console.log('selected', selectedTs ? window.calendarDate : null);
			});
			daysContainer.appendChild(btn);
		}

		// after rendering, apply highlight if needed
		highlightSelected();
	}

	prevBtn.addEventListener('click', ()=>{ viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1); render(); });
	nextBtn.addEventListener('click', ()=>{ viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1); render(); });

	render();
};