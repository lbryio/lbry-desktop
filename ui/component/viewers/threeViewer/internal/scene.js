import { Color } from 'three-full/sources/math/Color';
import { HemisphereLight } from 'three-full/sources/lights/HemisphereLight';
import { DirectionalLight } from 'three-full/sources/lights/DirectionalLight';
import { Scene } from 'three-full/sources/scenes/Scene';
import { Fog } from 'three-full/sources/scenes/Fog';

const addLights = (scene, color, groundColor) => {
  // Light color
  const lightColor = new Color(color);
  // Main light
  const light = new HemisphereLight(lightColor, groundColor, 0.4);
  // Shadow light
  const shadowLight = new DirectionalLight(lightColor, 0.4);
  shadowLight.position.set(100, 50, 100);
  // Back light
  const backLight = new DirectionalLight(lightColor, 0.6);
  backLight.position.set(-100, 200, 50);
  // Add lights to scene
  scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);
};

const ViewerScene = ({ backgroundColor, groundColor, showFog }) => {
  // Convert color
  const bgColor = new Color(backgroundColor);
  // New scene
  const scene = new Scene();
  // Background color
  scene.background = bgColor;
  // Fog effect
  scene.fog = showFog === true ? new Fog(bgColor, 1, 95) : null;
  // Add basic lights
  addLights(scene, '#FFFFFF', groundColor);
  // Return new three scene
  return scene;
};

export default ViewerScene;
