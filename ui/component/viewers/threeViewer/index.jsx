// @flow
import * as React from 'react';
import * as dat from 'dat.gui';
import LoadingScreen from 'component/common/loading-screen';

// ThreeJS
import { LoadingManager } from 'three-full/sources/loaders/LoadingManager';
import { STLLoader } from 'three-full/sources/loaders/STLLoader';
import { OBJLoader2 } from 'three-full/sources/loaders/OBJLoader2';
import { OrbitControls } from 'three-full/sources/controls/OrbitControls';
import { Geometry } from 'three-full/sources/core/Geometry';
import { Box3 } from 'three-full/sources/math/Box3';
import { Vector3 } from 'three-full/sources/math/Vector3';
import { Mesh } from 'three-full/sources/objects/Mesh';
import { Group } from 'three-full/sources/objects/Group';
import { PerspectiveCamera } from 'three-full/sources/cameras/PerspectiveCamera';
import { MeshPhongMaterial } from 'three-full/sources/materials/MeshPhongMaterial';
import detectWebGL from './internal/detector';
import ThreeGrid from './internal/grid';
import ThreeScene from './internal/scene';
import ThreeRenderer from './internal/renderer';

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
  if (fileType && downloadPath) {
    const manager = Manager(managerEvents);
    const loader = Loader(fileType, manager);

    if (loader) {
      loader.load(`file://${downloadPath}`, data => {
        renderModel(fileType, data);
      });
    }
  }
};

type viewerTheme = {
  showFog: boolean,
  gridColor: number,
  backgroundColor: number,
  centerLineColor: number,
};

type Props = {
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
  static testWebgl = (): Promise<void> =>
    new Promise((resolve, reject) => {
      if (detectWebGL()) resolve();
      else reject();
    });

  static createOrbitControls(camera: any, canvas: any) {
    const controls = new OrbitControls(camera, canvas);
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

  static fitMeshToCamera(group: any) {
    const max = { x: 0, y: 0, z: 0 };
    const min = { x: 0, y: 0, z: 0 };

    group.traverse(child => {
      if (child instanceof Mesh) {
        const box = new Box3().setFromObject(child);
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
    const box = new Box3().setFromObject(group);
    // Update position
    box.getCenter(group.position);
    group.position.multiplyScalar(-1);
    group.position.setY(group.position.y + meshY * scaleFactor);
  }

  /*
    See: https://github.com/mrdoob/three.js/blob/dev/docs/scenes/js/material.js#L195
  */

  constructor(props: Props) {
    super(props);
    // Object defualt color
    this.materialColor = 0xffffff;
    // Default viewer Theme
    this.theme = {
      showFog: true,
      gridColor: 0x414e5c,
      centerLineColor: 0x7f8c8d,
      backgroundColor: 0x0b0c0d,
    };
    // State
    this.state = {
      error: null,
      isReady: false,
      isLoading: false,
    };
    // Internal objects
    this.gui = null;
    this.grid = null;
    this.mesh = null;
    this.camera = null;
    this.frameID = null;
    this.renderer = null;
    this.material = null;
    this.geometry = null;
    this.targetCenter = null;
    this.bufferGeometry = null;
  }

  componentDidMount() {
    ThreeViewer.testWebgl()
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
        if (child instanceof Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        }
      });
      // Clean up controls
      if (this.controls) this.controls.dispose();
      // Clean up scene
      if (this.scene) this.scene.dispose();

      if (this.renderer) {
        this.renderer.context = null;
        this.renderer.domElement = null;
        this.renderer.renderLists.dispose();
        this.renderer.forceContextLoss();
        this.renderer.dispose();
        this.renderer = null;
      }
      // Stop animation
      cancelAnimationFrame(this.frameID);
      // Destroy GUI Controls
      if (this.gui) this.gui.destroy();
    }
  }

  // Define component types
  theme: viewerTheme;
  materialColor: number;
  // Refs
  viewer: ?HTMLElement;
  guiContainer: ?HTMLElement;
  // Too complex to add a custom type
  gui: any;
  grid: any;
  mesh: any;
  scene: any;
  camera: any;
  frameID: any;
  controls: any;
  material: any;
  geometry: any;
  targetCenter: any;
  bufferGeometry: any;

  updateMaterial(material: any, geometry: any) {
    this.material.vertexColors = +material.vertexColors; // Ensure number
    this.material.side = +material.side; // Ensure number
    this.material.needsUpdate = true;
    // If Geometry needs update
    if (geometry) {
      this.geometry.verticesNeedUpdate = true;
      this.geometry.normalsNeedUpdate = true;
      this.geometry.colorsNeedUpdate = true;
    }
  }

  transformGroup(group: any) {
    ThreeViewer.fitMeshToCamera(group);
    if (!this.targetCenter) {
      const box = new Box3();
      const center = new Vector3();
      this.targetCenter = box.setFromObject(this.mesh).getCenter(center);
    }
    this.updateControlsTarget(this.targetCenter);
  }

  createInterfaceControls() {
    if (this.guiContainer && this.mesh) {
      this.gui = new dat.GUI({ autoPlace: false, name: 'controls' });

      const config = {
        color: this.materialColor,
        reset: () => {
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
        },
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
          this.updateMaterial(this.material);
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

      if (this.guiContainer) {
        this.guiContainer.appendChild(this.gui.domElement);
      }
    }
  }

  createGeometry(data: any) {
    this.bufferGeometry = data;
    this.bufferGeometry.computeBoundingBox();
    this.bufferGeometry.center();
    this.bufferGeometry.rotateX(-Math.PI / 2);
    this.bufferGeometry.lookAt(new Vector3(0, 0, 1));
    // Get geometry from bufferGeometry
    this.geometry = new Geometry().fromBufferGeometry(this.bufferGeometry);
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
    const { offsetWidth: width, offsetHeight: height } = this.viewer || {};
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.renderer.setSize(width, height);
  };

  updateControlsTarget(point: { x: number, y: number, z: number }) {
    this.controls.target.fromArray([point.x, point.y, point.z]);
    this.controls.update();
  }

  restoreCamera() {
    this.controls.reset();
    this.camera.position.set(-9.5, 14, 11);
    this.updateControlsTarget(this.targetCenter);
  }

  // Flow requested to add it here
  renderer: any;

  renderStl(data: any) {
    this.createGeometry(data);
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.name = 'model';
    this.scene.add(this.mesh);
    this.transformGroup(this.mesh);
  }

  renderObj(event: any) {
    const mesh = event.detail.loaderRootNode;
    this.mesh = new Group();
    this.mesh.name = 'model';

    // Assign new material
    mesh.traverse(child => {
      if (child instanceof Mesh) {
        // Get geometry from child
        const geometry = new Geometry();
        geometry.fromBufferGeometry(child.geometry);
        geometry.mergeVertices();
        geometry.computeVertexNormals();
        // Create and regroup inner objects
        const innerObj = new Mesh(geometry, this.material);
        this.mesh.add(innerObj);
        // Clean up geometry
        geometry.dispose();
        child.geometry.dispose();
      }
    });
    this.scene.add(this.mesh);
    this.transformGroup(this.mesh);
  }

  renderModel(fileType: string, parsedData: any) {
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

    this.scene = ThreeScene(this.theme);

    const canvas = this.renderer.domElement;
    const { offsetWidth: width, offsetHeight: height } = this.viewer || {};

    // Grid
    this.grid = ThreeGrid({ size: 100, gridColor, centerLineColor });
    this.scene.add(this.grid);
    // Camera
    this.camera = new PerspectiveCamera(80, width / height, 0.1, 1000);
    this.camera.position.set(-9.5, 14, 11);

    // Controls
    this.controls = ThreeViewer.createOrbitControls(this.camera, canvas);

    // Set viewer size
    this.renderer.setSize(width, height);

    // Create material
    this.material = new MeshPhongMaterial({
      depthWrite: true,
      flatShading: true,
      vertexColors: 1,
    });

    // Set material color
    this.material.color.set(this.materialColor);

    // Load file and render mesh
    this.startLoader();

    // Append canvas
    if (this.viewer) {
      this.viewer.appendChild(canvas);
    }

    const updateScene = () => {
      this.frameID = requestAnimationFrame(updateScene);
      if (this.controls.autoRotate) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    updateScene();
  }

  render() {
    const { error, isReady, isLoading } = this.state;
    const loadingMessage = __('Loading 3D model.');
    const showLoading = isLoading && !error && !isReady;
    const containerClass = 'gui-container';

    return (
      <>
        <div className="file-render__viewer file-render__viewer--three">
          <div ref={element => (this.guiContainer = element)} className={containerClass} />
          <div className="three-viewer" ref={viewer => (this.viewer = viewer)}>
            {error && <LoadingScreen status={error} spinner={false} />}
            {showLoading && <LoadingScreen status={loadingMessage} spinner />}
          </div>
        </div>
      </>
    );
  }
}

export default ThreeViewer;
