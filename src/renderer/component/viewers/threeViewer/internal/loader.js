import { LoadingManager, STLLoader, OBJLoader2 } from './three';

const Manager = ({ onLoad, onStart, onError }) => {
  const manager = new LoadingManager();
  manager.onLoad = onLoad;
  manager.onStart = onStart;
  manager.onError = onError;

  return manager;
};

const Loader = (fileType, manager) => {
  const fileTypes = {
    stl: () => new STLLoader(manager),
    obj: () => new OBJLoader2(manager),
  };
  return fileTypes[fileType] ? fileTypes[fileType]() : null;
};

const ThreeLoader = ({ fileType = null, downloadPath = null }, renderModel, managerEvents) => {
  if (fileType) {
    const manager = Manager(managerEvents);
    const loader = Loader(fileType, manager);

    if (loader) {
      loader.load(`file://${downloadPath}`, data => {
        renderModel(fileType, data);
      });
    }
  }
};

export default ThreeLoader;
