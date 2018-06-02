import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

const Grid = ({ size, color }) => {
  const divisions = size;
  const grid = new THREE.GridHelper(size, divisions, color, color);
  grid.material.opacity = 0.25;
  grid.material.transparent = true;
  return grid;
};

const Camera = aspect => {
  const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  return camera;
};

const Controls = (camera, canvas) => {
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.75;
  controls.enableZoom = true;
  return controls;
};

const Plane = (color, width, height) => {
  const mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(width, height),
    new THREE.MeshPhongMaterial({ color, depthWrite: false, shininess: 1 })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  return mesh;
};

const Light = (color, intensity, x, y, z) => {
  const light = new THREE.DirectionalLight(color, intensity, 1.75, 1000);
  light.position.set(x, y, z).normalize();
  light.lookAt(0, 0, 0);
  return light;
};

// Three-Point Lighting
const addLights = scene => {
  const surface = 1000;
  const distance = 100;
  // Main light
  const keyLight = Light(0xffffff, 0.5, distance * 0.25, distance, distance * -0.25);

  // Shadow
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;

  // Secondary lights
  const fillLight = Light(0xffffff, 0.25, distance * -0.25, 0, distance * -0.25);
  const backLight = Light(0xffffff, 0.15, 0, distance * -0.5, distance);
  // Add to scene
  scene.add(keyLight);
  scene.add(fillLight);
  scene.add(backLight);
};

const getDimensions = mesh => {
  const box = new THREE.Box3().setFromObject(mesh);
  return {
    x: box.max.x / 2,
    y: box.max.y / 2,
    z: box.max.z / 2,
  };
};

const Scene = background => {
  const scene = new THREE.Scene();
  // Background Color
  scene.background = new THREE.Color(background);

  // Fog effect
  scene.fog = new THREE.Fog(background, 1, 20);

  // Ambient light
  const ambient = new THREE.AmbientLight(background, 0.5);
  scene.add(ambient);

  // Grid helper
  const grid = Grid({ size: 100, color: 0x000000 });
  scene.add(grid);

  // Add base ground
  const ground = Plane(0xdedede, 1000, 100);
  scene.add(ground);

  // Add basic lights
  addLights(scene);

  return scene;
};

export { Scene, Camera, Controls, getDimensions };
