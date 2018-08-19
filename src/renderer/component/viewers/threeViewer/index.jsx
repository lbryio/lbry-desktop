// @flow
import * as React from 'react';
import * as dat from 'dat.gui';
import classNames from 'classnames';
import LoadingScreen from 'component/common/loading-screen';

// ThreeJS
import * as THREE from './internal/three';
import detectWebGL from './internal/detector';
import ThreeGrid from './internal/grid';
import ThreeScene from './internal/scene';
import ThreeLoader from './internal/loader';
import ThreeRenderer from './internal/renderer';

type Props = {
  theme: string,
  source: {
    fileType: string,
    downloadPath: string,
  },
};

type State = {
  error: ?string,
  isReady: boolean,
  isLoading: boolean,
};

class ThreeViewer extends React.PureComponent<Props, State> {
  static testWebgl = new Promise((resolve, reject) => {
    if (detectWebGL()) resolve();
    else reject();
  });

  static createOrbitControls(camera, canvas) {
    const controls = new THREE.OrbitControls(camera, canvas);
    // Controls configuration
    controls.enableDamping = true;
    controls.dampingFactor = 0.75;
    controls.enableZoom = true;
    controls.minDistance = 5;
    controls.maxDistance = 14;
    controls.autoRotate = false;
    controls.enablePan = false;
    controls.saveState();
    return controls;
  }

  static fitMeshToCamera(group) {
    const max = { x: 0, y: 0, z: 0 };
    const min = { x: 0, y: 0, z: 0 };

    group.traverse(child => {
      if (child instanceof THREE.Mesh) {
        const box = new THREE.Box3().setFromObject(child);
        // Max
        max.x = box.max.x > max.x ? box.max.x : max.x;
        max.y = box.max.y > max.y ? box.max.y : max.y;
        max.z = box.max.z > max.z ? box.max.z : max.z;
        // Min
        min.x = box.min.x < min.x ? box.min.x : min.x;
        min.y = box.min.y < min.y ? box.min.y : min.y;
        min.z = box.min.z < min.z ? box.min.z : min.z;
      }
    });

    const meshY = Math.abs(max.y - min.y);
    const meshX = Math.abs(max.x - min.x);
    const scaleFactor = 10 / Math.max(meshX, meshY);

    group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    group.position.setY((meshY / 2) * scaleFactor);
    // Reset object position
    const box = new THREE.Box3().setFromObject(group);
    // Update position
    box.getCenter(group.position);
    group.position.multiplyScalar(-1);
    group.position.setY(group.position.y + meshY * scaleFactor);
  }

  /*
    See: https://github.com/mrdoob/three.js/blob/dev/docs/scenes/js/material.js#L195
  */

  static updateMaterial(material, geometry) {
    material.vertexColors = +material.vertexColors; // Ensure number
    material.side = +material.side; // Ensure number
    material.needsUpdate = true;
    // If Geometry needs update
    if (geometry) {
      geometry.verticesNeedUpdate = true;
      geometry.normalsNeedUpdate = true;
      geometry.colorsNeedUpdate = true;
    }
  }

  constructor(props: Props) {
    super(props);
    const { theme } = this.props;
    this.viewer = React.createRef();
    this.guiContainer = React.createRef();
    // Object defualt color
    this.materialColor = '#44b098';
    // Viewer themes
    this.themes = {
      dark: {
        gridColor: '#414e5c',
        groundColor: '#13233C',
        backgroundColor: '#13233C',
        centerLineColor: '#7f8c8d',
      },
      light: {
        gridColor: '#7f8c8d',
        groundColor: '#DDD',
        backgroundColor: '#EEE',
        centerLineColor: '#2F2F2F',
      },
    };
    // Select current theme
    this.theme = this.themes[theme] || this.themes.light;
    // State
    this.state = {
      error: null,
      isReady: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    ThreeViewer.testWebgl
      .then(() => {
        this.renderScene();
        // Update render on resize window
        window.addEventListener('resize', this.handleResize, false);
      })
      .catch(() => {
        // No webgl support, handle Error...
        // TODO: Use a better error message
        this.setState({ error: "Sorry, your computer doesn't support WebGL." });
      });
  }

  componentWillUnmount() {
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize, false);
    // Free memory
    if (this.renderer && this.mesh) {
      // Clean up group
      this.scene.remove(this.mesh);
      if (this.mesh.geometry) this.mesh.geometry.dispose();
      if (this.mesh.material) this.mesh.material.dispose();
      // Cleanup shared geometry
      if (this.geometry) this.geometry.dispose();
      if (this.bufferGeometry) this.bufferGeometry.dispose();
      // Clean up shared material
      if (this.material) this.material.dispose();
      // Clean up grid
      if (this.grid) {
        this.grid.material.dispose();
        this.grid.geometry.dispose();
      }
      // Clean up group items
      this.mesh.traverse(child => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        }
      });
      // Clean up controls
      if (this.controls) this.controls.dispose();
      // It's unclear if we need this:
      if (this.renderer) {
        this.renderer.renderLists.dispose();
        this.renderer.dispose();
      }
      // Stop animation
      cancelAnimationFrame(this.frameID);
      // Destroy GUI Controls
      if (this.gui) this.gui.destroy();
      // Empty objects
      this.grid = null;
      this.mesh = null;
      this.renderer = null;
      this.material = null;
      this.geometry = null;
      this.bufferGeometry = null;
    }
  }

  transformGroup(group) {
    ThreeViewer.fitMeshToCamera(group);

    if (!this.targetCenter) {
      const box = new THREE.Box3();
      this.targetCenter = box.setFromObject(this.mesh).getCenter();
    }
    this.updateControlsTarget(this.targetCenter);
  }

  createInterfaceControls() {
    if (this.guiContainer && this.mesh) {
      this.gui = new dat.GUI({ autoPlace: false, name: 'controls' });

      const config = {
        color: this.materialColor,
      };

      config.reset = () => {
        // Reset material color
        config.color = this.materialColor;
        // Reset material
        this.material.color.set(config.color);
        this.material.flatShading = true;
        this.material.shininess = 30;
        this.material.wireframe = false;
        // Reset autoRotate
        this.controls.autoRotate = false;
        // Reset camera
        this.restoreCamera();
      };

      const materialFolder = this.gui.addFolder('Material');

      // Color picker
      const colorPicker = materialFolder
        .addColor(config, 'color')
        .name('Color')
        .listen();

      colorPicker.onChange(color => {
        this.material.color.set(color);
      });

      materialFolder
        .add(this.material, 'shininess', 0, 100)
        .name('Shininess')
        .listen();

      materialFolder
        .add(this.material, 'flatShading')
        .name('FlatShading')
        .onChange(() => {
          ThreeViewer.updateMaterial(this.material);
        })
        .listen();

      materialFolder
        .add(this.material, 'wireframe')
        .name('Wireframe')
        .listen();

      const sceneFolder = this.gui.addFolder('Scene');

      sceneFolder
        .add(this.controls, 'autoRotate')
        .name('Auto-Rotate')
        .listen();

      sceneFolder.add(config, 'reset').name('Reset');

      this.guiContainer.current.appendChild(this.gui.domElement);
    }
  }

  createGeometry(data) {
    this.bufferGeometry = data;
    this.bufferGeometry.computeBoundingBox();
    this.bufferGeometry.center();
    this.bufferGeometry.rotateX(-Math.PI / 2);
    this.bufferGeometry.lookAt(new THREE.Vector3(0, 0, 1));
    // Get geometry from bufferGeometry
    this.geometry = new THREE.Geometry().fromBufferGeometry(this.bufferGeometry);
    this.geometry.mergeVertices();
    this.geometry.computeVertexNormals();
  }

  startLoader() {
    const { source } = this.props;

    if (source) {
      ThreeLoader(source, this.renderModel.bind(this), {
        onStart: this.handleStart,
        onLoad: this.handleReady,
        onError: this.handleError,
      });
    }
  }

  handleStart = () => {
    this.setState({ isLoading: true });
  };

  handleReady = () => {
    this.setState({ isReady: true, isLoading: false });
    // GUI
    this.createInterfaceControls();
  };

  handleError = () => {
    this.setState({ error: "Sorry, looks like we can't load this file" });
  };

  handleResize = () => {
    const { offsetWidth: width, offsetHeight: height } = this.viewer.current;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.renderer.setSize(width, height);
  };

  updateControlsTarget(point) {
    this.controls.target.fromArray([point.x, point.y, point.z]);
    this.controls.update();
  }

  restoreCamera() {
    this.controls.reset();
    this.camera.position.set(-9.5, 14, 11);
    this.updateControlsTarget(this.targetCenter);
  }

  renderStl(data) {
    this.createGeometry(data);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = 'model';
    this.scene.add(this.mesh);
    this.transformGroup(this.mesh);
  }

  renderObj(event) {
    const mesh = event.detail.loaderRootNode;
    this.mesh = new THREE.Group();
    this.mesh.name = 'model';

    // Assign new material
    mesh.traverse(child => {
      if (child instanceof THREE.Mesh) {
        // Get geometry from child
        const geometry = new THREE.Geometry();
        geometry.fromBufferGeometry(child.geometry);
        geometry.mergeVertices();
        geometry.computeVertexNormals();
        // Create and regroup inner objects
        const innerObj = new THREE.Mesh(geometry, this.material);
        this.mesh.add(innerObj);
        // Clean up geometry
        geometry.dispose();
        child.geometry.dispose();
      }
    });
    this.scene.add(this.mesh);
    this.transformGroup(this.mesh);
  }

  renderModel(fileType, parsedData) {
    const renderTypes = {
      stl: data => this.renderStl(data),
      obj: data => this.renderObj(data),
    };

    if (renderTypes[fileType]) {
      renderTypes[fileType](parsedData);
    }
  }

  renderScene() {
    const { gridColor, centerLineColor } = this.theme;

    this.renderer = ThreeRenderer({
      antialias: true,
      shadowMap: true,
      gammaCorrection: true,
    });

    this.scene = ThreeScene({
      showFog: true,
      ...this.theme,
    });

    const viewer = this.viewer.current;
    const canvas = this.renderer.domElement;
    const { offsetWidth: width, offsetHeight: height } = viewer;

    // Grid
    this.grid = ThreeGrid({ size: 100, gridColor, centerLineColor });
    this.scene.add(this.grid);
    // Camera
    this.camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);
    this.camera.position.set(-9.5, 14, 11);

    // Controls
    this.controls = ThreeViewer.createOrbitControls(this.camera, canvas);

    // Set viewer size
    this.renderer.setSize(width, height);

    // Create model material
    this.material = new THREE.MeshPhongMaterial({
      depthWrite: true,
      flatShading: true,
      vertexColors: THREE.FaceColors,
    });

    // Set material color
    this.material.color.set(this.materialColor);

    // Load file and render mesh
    this.startLoader();

    // Append canvas
    viewer.appendChild(canvas);

    const updateScene = () => {
      this.frameID = requestAnimationFrame(updateScene);
      if (this.controls.autoRotate) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    updateScene();
  }

  render() {
    const { theme } = this.props;
    const { error, isReady, isLoading } = this.state;
    const loadingMessage = __('Loading 3D model.');
    const showViewer = isReady && !error;
    const showLoading = isLoading && !error;

    // Adaptive theme for gui controls
    const containerClass = classNames('gui-container', { light: theme === 'light' });

    return (
      <React.Fragment>
        {error && <LoadingScreen status={error} spinner={false} />}
        {showLoading && <LoadingScreen status={loadingMessage} spinner />}
        <div ref={this.guiContainer} className={containerClass} />
        <div
          style={{ opacity: showViewer ? 1 : 0 }}
          className="three-viewer file-render__viewer"
          ref={this.viewer}
        />
      </React.Fragment>
    );
  }
}

export default ThreeViewer;
