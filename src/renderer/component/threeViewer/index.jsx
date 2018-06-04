// @flow
import * as React from 'react';
import * as THREE from './internal/three.js';
import detectWebGL from './internal/detector.js';
import ThreeScene from './internal/scene.js';
import ThreeLoader from './internal/loader.js';
import ThreeRenderer from './internal/renderer.js';

type Props = {
  config: {
    gridColor: string,
    groundColor: string,
    backgroundColor: string,
    lineCenterColor: string,
  },
  source: {
    fileType: string,
    filePath: string,
  },
};

class ThreeViewer extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    //Main container
    this.viewer = React.createRef();
    // Object colors
    this.materialColors = {
      red: '#e74c3c',
      blue: '#3498db',
      green: '#44b098',
      orange: '#f39c12',
    };
  }

  createOrbitControls(camera, canvas) {
    const controls = new THREE.OrbitControls(camera, canvas);
    // Controls configuration
    controls.enableDamping = true;
    controls.dampingFactor = 0.75;
    controls.enableZoom = true;
    controls.minDistance = 1;
    controls.maxDistance = 50;
    return controls;
  }

  createGeometry(data) {
    const geometry = new THREE.Geometry();
    geometry.fromBufferGeometry(data);
    geometry.computeBoundingBox();
    geometry.center();
    geometry.rotateX(-Math.PI / 2);
    geometry.lookAt(new THREE.Vector3(0, 0, 1));
    return geometry;
  }

  createMesh(geometry) {
    const materialColor = new THREE.Color(this.materialColors['red']);
    const material = new THREE.MeshPhongMaterial({
      color: materialColor,
      depthWrite: true,
      vertexColors: THREE.FaceColors,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'objectGroup';

    this.scene.add(mesh);
    this.fitMeshToCamera(mesh);
    this.setControlsTarget(mesh.position);
  }

  fitMeshToCamera(group) {
    let max = { x: 0, y: 0, z: 0 };
    let min = { x: 0, y: 0, z: 0 };

    group.traverse(child => {
      if (child instanceof THREE.Mesh) {
        const box = new THREE.Box3().setFromObject(group);
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
    const meshZ = Math.abs(max.z - min.z);
    const scaleFactor = 10 / Math.max(meshX, meshY);

    group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    group.position.y = meshY / 2 * scaleFactor;
    group.position.multiplyScalar(-1);
    group.position.y += meshY * scaleFactor;
  }

  setControlsTarget(point) {
    this.controls.target.fromArray([point.x, point.y, point.z]);
    this.controls.update();
  }

  startLoader() {
    const { source } = this.props;
    source &&
      ThreeLoader(source, this.renderModel.bind(this), {
        onLoad: this.handleLoad.bind(this),
        onError: this.handleError.bind(this),
        onProgress: this.handleProgress.bind(this),
      });
  }

  handleLoad() {
    // Handle load ready
  }

  handleResize = () => {
    const { offsetWidth: width, offsetHeight: height } = this.viewer.current;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.renderer.setSize(width, height);
  };

  handleError(url) {
    // Handle error
  }

  handleProgress(url, currentItem, totalItems) {
    /// Handle progress
  }

  renderModel(fileType, data) {
    const geometry = this.createGeometry(data);
    const mesh = this.createMesh(geometry);
    this.onViewerReady();
  }

  renderScene() {
    this.renderer = ThreeRenderer({
      antialias: true,
      shadowMap: true,
    });

    this.scene = ThreeScene({
      showFog: true,
      showGrid: true,
      groundColor: '#DDD',
      backgroundColor: '#EEE',
    });

    const viewer = this.viewer.current;
    const canvas = this.renderer.domElement;
    const { offsetWidth: width, offsetHeight: height } = viewer;
    // Camera
    this.camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);
    this.camera.position.set(-9.5, 14, 11);
    // Controls
    this.controls = this.createOrbitControls(this.camera, canvas);
    // Set viewer size
    this.renderer.setSize(width, height);
    // Load file and render mesh
    this.startLoader();

    const updateScene = () => {
      requestAnimationFrame(updateScene);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    updateScene();
    // Append canvas
    viewer.appendChild(canvas);
  }

  componentDidMount() {
    if (detectWebGL()) {
      this.renderScene();
      // Update render on resize window
      window.addEventListener('resize', this.handleResize, false);
    } else {
      // No webgl support, handle Error...
      console.error('NO WEBGL!!!');
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  render() {
    return (
      <React.Fragment>
        <div className="three-viewer" ref={this.viewer} />
      </React.Fragment>
    );
  }
}

export default ThreeViewer;
