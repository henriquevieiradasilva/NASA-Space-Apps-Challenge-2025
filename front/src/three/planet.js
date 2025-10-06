import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import getStarfield from "./getStarfield.js";
import { getFresnelMat } from "./getFresnelMat.js";

export function setupPlanet() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.z = 80;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1.2;
  controls.enabled = false;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  const detail = 12;
  const loader = new THREE.TextureLoader();
  const geometry = new THREE.IcosahedronGeometry(1, detail);

  const material = new THREE.MeshPhongMaterial({
    map: loader.load("./textures/00_earthmap4k.jpg"),
    specularMap: loader.load("./textures/02_earthspec1k.jpg"),
    bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
    bumpScale: 0.04,
  });

  const earthMesh = new THREE.Mesh(geometry, material);
  earthMesh.rotation.y = Math.PI;
  earthGroup.add(earthMesh);

  earthMesh.userData.rotating = true;
  earthMesh.userData.rotationLocked = false;

  const fresnelMat = getFresnelMat();
  const glowMesh = new THREE.Mesh(geometry, fresnelMat);
  glowMesh.scale.setScalar(1.001);
  glowMesh.userData.rotating = earthMesh.userData.rotating;
  glowMesh.userData.rotationLocked = earthMesh.userData.rotationLocked;
  earthGroup.add(glowMesh);


  const stars = getStarfield({ numStars: 5000 });
  scene.add(stars);

  const sunLight = new THREE.AmbientLight(0xffffff, 2.0);
  scene.add(sunLight);


  function animate() {
    requestAnimationFrame(animate);

    if (earthMesh.userData.rotating) {
      glowMesh.rotation.y += 0.002;
    }

    stars.rotation.y -= 0.00025;

    renderer.render(scene, camera);
  }
  animate();

  function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', handleWindowResize, false);

  function Aproximar() {
    controls.enabled = true;
    for (let i = 80; i >= 3; i--) {
      setTimeout(() => {
        camera.position.z = i;
        console.log("camera.z ->", camera.position.z);
      }, 25 * (100 - i));
    }
  }

  return {
    earthGroup,
    earthMesh,
    glowMesh,
    camera,
    renderer,
    controls,
    startApproach: Aproximar,
  };
}
