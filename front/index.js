import { setupPlanet } from "./src/three/planet.js"; 
import { initCalendar } from "./src/ui/calendar.js";
import { setupLocationSearch } from './src/ui/searchBar.js';
const { earthGroup, startApproach } = setupPlanet();

setupLocationSearch(earthGroup);

const startBtn = document.getElementById('start');
if (startBtn && typeof startApproach === 'function') {
	startBtn.addEventListener('click', () => {
		const title = document.getElementById('title');
		if (title) title.classList.add('pop-fade');
		startBtn.classList.add('pop-fade');
		startApproach();
		startBtn.disabled = true;

		// reveal and focus the search bar
		const search = document.getElementById('searchBar');
		if (search) {
			setTimeout(() => search.classList.add('search-visible'), 2500);
		}
        const cal = document.getElementById('calendar');
        if (cal) {
            initCalendar();
            setTimeout(() => cal.classList.add('calendar-visible'), 2500);
        }
	});
}

// Optional: Add event listener to handle window resize
// window.addEventListener('resize', handleWindowResize, false);