import { WebGLRenderer } from './three';

const ThreeRenderer = ({ antialias, shadowMap }) => {
  const renderer = new WebGLRenderer({
    antialias,
  });
  // Renderer configuration
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = shadowMap;
  return renderer;
};

export default ThreeRenderer;
