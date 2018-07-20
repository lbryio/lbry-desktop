import * as THREE from './three';

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

const Scene = ({ backgroundColor, groundColor, showFog }) => {
  // Convert color
  const bgColor = new THREE.Color(backgroundColor);
  // New scene
  const scene = new THREE.Scene();
  // Background color
  scene.background = bgColor;
  // Fog effect
  scene.fog = showFog === true ? new THREE.Fog(bgColor, 1, 95) : null;
  // Add basic lights
  addLights(scene, '#FFFFFF', groundColor);
  // Return new three scene
  return scene;
};

export default Scene;
