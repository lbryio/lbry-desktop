import * as THREE from './three.js';

const addGrid = (scene, { colorGrid, colorCenterLine, size }) => {
  const divisions = size / 10;
  const grid = new THREE.GridHelper(
    size,
    divisions,
    new THREE.Color(colorCenterLine),
    new THREE.Color(colorGrid)
  );
  grid.material.opacity = 0.45;
  grid.material.transparent = true;
  scene.add(grid);
};

const addLights = (scene, color, groundColor) => {
  // Light color
  const lightColor = new THREE.Color(color);
  // Main light
  const light = new THREE.HemisphereLight(lightColor, groundColor, 0.4);
  // Shadow light
  const shadowLight = new THREE.DirectionalLight(lightColor, 0.4);
  shadowLight.position.set(100, 50, 100);
  // Back light
  const backLight = new THREE.DirectionalLight(lightColor, 0.6);
  backLight.position.set(-100, 200, 50);
  // Add lights to scene
  scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);
};

const Scene = ({ backgroundColor, groundColor, showFog, showGrid }) => {
  // Convert colors
  backgroundColor = new THREE.Color(backgroundColor);
  groundColor = new THREE.Color(groundColor);
  // New scene
  const scene = new THREE.Scene();
  // Background color
  scene.background = backgroundColor;
  // Fog effect
  scene.fog = showFog === true ? new THREE.Fog(backgroundColor, 1, 125) : null;

  showGrid &&
    addGrid(scene, {
      size: 100,
      colorGrid: '#7f8c8d',
      colorCenterLine: '#2F2F2F',
    });

  // Add basic lights
  addLights(scene, '#FFFFFF', groundColor);
  // Return new three scene
  return scene;
};

export default Scene;
