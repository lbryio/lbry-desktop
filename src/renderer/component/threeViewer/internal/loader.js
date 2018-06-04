import { LoadingManager, STLLoader, OBJLoader } from './three.js';

const Manager = ({ onLoad, onStart, onProgress, onError }) => {
  const manager = new THREE.LoadingManager();
  manager.onLoad = onLoad;
  manager.onStart = onStart;
  //manager.onProgress = onProgress;
  manager.onError = onError;

  return manager;
};

const Loader = (fileType, manager) => {
  const fileTypes = {
    stl: () => new STLLoader(manager),
    obj: () => new OBJLoader(manager),
  };
  return fileTypes[fileType] ? fileTypes[fileType]() : null;
};

const ThreeLoader = ({ fileType, filePath }, renderModel, managerEvents) => {
  if (!fileType) return;

  const manager = Manager(managerEvents);
  const loader = Loader(fileType, manager);

  // Unsuported loader
  if (!loader) return false;

  loader.load(filePath, data => {
    renderModel(fileType, data);
  });
};

export default ThreeLoader;
