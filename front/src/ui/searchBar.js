import { fetchCoordinates } from '../api/cityApi.js';
import { coordToVector3 } from '../../utils.js'; 
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

export function rotateGlobeToCoordinates(lat, lon, earthGroup) {
  const targetVector = coordToVector3(lat, lon, 1);
  const upVector = new THREE.Vector3(0, 1, 0); // Eixo Y como "cima"
  
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(upVector, targetVector.normalize());
  
  // Cria a rotação final com base na longitude para a frente da tela
  const lonQuaternion = new THREE.Quaternion();
  lonQuaternion.setFromAxisAngle(upVector, lon * Math.PI / 180);
  
  // Combina as duas rotações e anima
  const finalQuaternion = lonQuaternion.multiply(quaternion);
  
  new TWEEN.Tween(earthGroup.quaternion)
    .to({ x: finalQuaternion.x, y: finalQuaternion.y, z: finalQuaternion.z, w: finalQuaternion.w }, 1000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .start();
    console.log(targetVector);
}

export function setupLocationSearch(earthGroup) {
    const searchBar = document.getElementById("searchBar");
    if(searchBar) {
        searchBar.addEventListener("keydown", async (event)=> {
            if(event.key === "Enter") {
                const city = searchBar.value.trim();
                if(!city){
                    alert("Please enter a city name.");
                    return;
                }

                const coords = await fetchCoordinates(city);
                if(coords) {
                    rotateGlobeToCoordinates(coords.lat, coords.lon, earthGroup);
                    alert(`Coordinates for ${city}: Latitude ${coords.lat}, Longitude ${coords.lon}`);
                } else {
                    alert(`City "${city}" not found.`);
                }
                
                searchBar.value = ""; 
            }
        });
    }
    else   {
        console.log("Salve")
    }

} 

