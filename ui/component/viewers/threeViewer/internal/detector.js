const detectWebGL = () => {
  // Create canvas element.
  const canvas = document.createElement('canvas');
  // Get WebGLRenderingContext from canvas element.
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  // Return the result.
  return gl && gl instanceof WebGLRenderingContext;
};

export default detectWebGL;
