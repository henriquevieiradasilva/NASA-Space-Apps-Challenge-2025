import { setupPlanet } from "./src/three/planet.js"; 
import { setupLocationSearch } from './src/ui/searchBar.js';

const { earthGroup } = setupPlanet();

setupLocationSearch(earthGroup);