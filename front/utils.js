import * as THREE from 'three';

export function coordToVector3(lat, lon, radius) {
  const latRad = lat * (Math.PI / 180);
  const lonRad = -lon * (Math.PI / 180);

  const x = radius * Math.cos(latRad) * Math.sin(lonRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.cos(lonRad);

  return new THREE.Vector3(x, y, z);
}