import { setupPlanet } from "./src/three/planet.js";
import initClickToPause from "./src/three/clickPlanet.js";
import { addPulseMarkerLoop } from "./src/three/showPointPlanet.js";
import { initFocusOnMarker } from "./src/three/focusOnMarker.js";
import { initCalendar } from "./src/ui/calendar.js";
import { showControlPanel } from "./src/ui/controlPanel.js";
import { initFindButton } from "./src/ui/findButton.js";
import { initResultsPanel } from "./src/ui/resultsPanel.js";

const { earthGroup, earthMesh, glowMesh, camera, renderer, controls, startApproach } = setupPlanet();

const clickPause = initClickToPause({
  domElement: renderer.domElement,
  camera,
  earthMesh,
  glowMesh,
  controls,
});

let currentPulseMarker = null;
let focusOnMarkerFn = null;

function showCityMarker(latDeg, lonDeg) {
  console.log("Marcador:", latDeg, lonDeg);

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

  const focusHandler = initFocusOnMarker(camera, controls, earthMesh, currentPulseMarker.group, 1000);
  focusOnMarkerFn = focusHandler.focusOnMarker;
}

document.addEventListener("locationFound", (e) => {
  const { lat, lon } = e.detail;
  showCityMarker(lat, lon);
});

const startBtn = document.getElementById("start");
if (startBtn && typeof startApproach === "function") {
  startBtn.addEventListener("click", () => {
    const title = document.getElementById("title");
    if (title) title.classList.add("pop-fade");
    startBtn.classList.add("pop-fade");

    startApproach();
    startBtn.disabled = true;

    const search = document.getElementById("searchBar");
    const cal = document.getElementById("calendar");

    if (search) {
      setTimeout(() => search.classList.add("search-visible"), 2500);
    }

    if (cal) {
      initCalendar();
      setTimeout(() => cal.classList.add("calendar-visible"), 2500);
    }

    setTimeout(() => showControlPanel({ revealSearch: true, revealCalendar: true }), 2500);

    initResultsPanel();
    initFindButton({
      focusOnMarker: () => {
        if (focusOnMarkerFn) focusOnMarkerFn();
        else console.warn("Nenhum marcador ativo para focar!");
      },
    });

    // 🔹 Mostrar o botão de info 1 segundo após o clique em "travel"
    const infoButton = document.getElementById("info-button");
    const infoBox = document.getElementById("info-box");

    if (infoButton && infoBox) {
      setTimeout(() => {
        infoButton.style.display = "block"; // torna o botão visível

        // alternar visibilidade da caixa ao clicar no botão
        infoButton.addEventListener("click", (e) => {
          e.stopPropagation();
          infoBox.classList.toggle("visible");
        });

        // fechar a info box ao clicar fora dela
        document.addEventListener("click", (e) => {
          if (infoBox.classList.contains("visible") && !infoBox.contains(e.target) && e.target !== infoButton) {
            infoBox.classList.remove("visible");
          }
        });
      }, 1000); // 1 segundo depois do clique em travel
    }
  });
}
