import { WebGLRenderer } from './three';

const ThreeRenderer = ({ antialias, shadowMap }) => {
  const renderer = new WebGLRenderer({
    antialias,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMapEnabled = shadowMap;
  return renderer;
};

export default ThreeRenderer;
