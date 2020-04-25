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

const ViewerScene = ({ backgroundColor, showFog }) => {
  // New scene
  const bg = new Color(backgroundColor);
  const scene = new Scene();
  // Transparent background
  scene.background = bg;
  // Add fog
  if (showFog) {
    scene.fog = new Fog(bg, 1, 54);
  }
  // Add basic lights
  addLights(scene, 0xffffff, bg);
  // Return new three scene
  return scene;
};

export default ViewerScene;
