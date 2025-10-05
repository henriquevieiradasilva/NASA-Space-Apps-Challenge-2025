import { setupPlanet } from "./src/three/planet.js";
import initClickToPause from "./src/three/clickPlanet.js";
import { addPulseMarkerLoop } from "./src/three/showPointPlanet.js";
import { initFocusOnMarker } from "./src/three/focusOnMarker.js";
import { initCalendar } from "./src/ui/calendar.js";
import { locationSearch } from './src/ui/searchBar.js';
import { showControlPanel } from "./src/ui/controlPanel.js";
import { initFindButton } from './src/ui/findButton.js';
import { initResultsPanel } from './src/ui/resultsPanel.js';

const { earthGroup, earthMesh, glowMesh, camera, renderer, controls, startApproach } = setupPlanet();

const clickPause = initClickToPause({
    domElement: renderer.domElement,
    camera,
    earthMesh,
    glowMesh,
    controls,
});

let currentPulseMarker = null;

function showCityMarker(latDeg, lonDeg) {
    console.log(latDeg, lonDeg);
	
	// Remove marcador antigo
    if (currentPulseMarker) {
        currentPulseMarker.dispose();
        currentPulseMarker = null;
    }

    currentPulseMarker = addPulseMarkerLoop(earthMesh, latDeg, lonDeg, {
        color: 0x00ff88,
        flipLongitude: true, 
        baseOuter: 0.2,
        minScale: 0.01,
        maxScale: 1,
        period: 1200,
    });

    // Foco suave
    initFocusOnMarker(camera, controls, earthMesh, currentPulseMarker.group, 1000);
}

// Evento de cidade encontrada
document.addEventListener("locationFound", (e) => {
    const { lat, lon } = e.detail;
    showCityMarker(lat, lon);
});

// Botão de iniciar aproximação
const startBtn = document.getElementById('start');
if (startBtn && typeof startApproach === 'function') {
    startBtn.addEventListener('click', () => {
        const title = document.getElementById('title');
        if (title) title.classList.add('pop-fade');
        startBtn.classList.add('pop-fade');
        startApproach();
        startBtn.disabled = true;

        const search = document.getElementById('searchBar');
        if (search) {
            setTimeout(() => search.classList.add('search-visible'), 2500);
        }
        const cal = document.getElementById('calendar');
        if (cal) {
            initCalendar();
            setTimeout(() => cal.classList.add('calendar-visible'), 2500);
        }
        setTimeout(() => showControlPanel({ revealSearch: true, revealCalendar: true }), 2500);
        initFindButton();
        initResultsPanel();
    });
}
