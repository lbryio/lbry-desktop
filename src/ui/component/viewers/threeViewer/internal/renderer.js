import { WebGLRenderer } from 'three-full/sources/renderers/WebGLRenderer';

const ThreeRenderer = ({ antialias, shadowMap, gammaCorrection }) => {
  const renderer = new WebGLRenderer({ antialias });
  // Renderer configuration
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaInput = gammaCorrection || false;
  renderer.gammaOutput = gammaCorrection || false;
  renderer.shadowMap.enabled = shadowMap || false;
  renderer.shadowMap.autoUpdate = false;
  return renderer;
};

export default ThreeRenderer;
