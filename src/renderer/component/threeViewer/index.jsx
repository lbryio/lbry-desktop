// @flow
import * as React from 'react';
import * as THREE from './internal/three.js';
import detectWebGL from './internal/detector.js';
import ThreeRenderer from './internal/renderer.js';
import ThreeScene from './internal/scene.js';

type Props = {};

// Camera
const Camera = aspect => {
  const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.set(-9.5, 14, 11);
  camera.lookAt(0, 0, 0);
  return camera;
};

// Orbit controls
const Controls = (camera, canvas) => {
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.75;
  controls.enableZoom = true;
  return controls;
};

const getDimensions = mesh => {
  const box = new THREE.Box3().setFromObject(mesh);
  return {
    x: box.max.x / 2,
    y: box.max.y / 2,
    z: box.max.z / 2,
  };
};

class ThreeViewer extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    //Main container
    this.viewer = React.createRef();
    // Threejs
    this.scene = ThreeScene({
      showFog: true,
      showGrid: true,
      groundColor: '#DDD',
      backgroundColor: '#EEE',
    });
    // Render scene
    if (detectWebGL()) {
      this.renderer = ThreeRenderer({
        antialias: true,
        shadowMap: true,
      });
    } else {
      // No webgl support
      console.error('NO WEBGL!!!');
    }
  }

  handleResize = () => {
    const { offsetWidth: width, offsetHeight: height } = this.viewer.current;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.renderer.setSize(width, height);
  };

  handleLoader() {
    /*
      var loader = new THREE.STLLoader();
				loader.load( '/home/btzr/Downloads/Bitcoin Cash accepted here.stl', ( geometry ) => {
					var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 10 } );
					var mesh = new THREE.Mesh( geometry, material );
					mesh.position.set( 0, 1, 0 );
					mesh.scale.set( 0.5, 0.5, 0.5 );
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					this.scene.add( mesh );
				} );
                */
  }

  renderScene() {
    const canvas = this.renderer.domElement;
    const { offsetWidth: width, offsetHeight: height } = this.viewer.current;
    const aspect = width / height;

    this.renderer.setSize(width, height);
    this.camera = Camera(aspect);
    this.controls = Controls(this.camera, canvas);
    this.controls.update();

    this.createMesh();
    this.handleLoader();

    const updateScene = () => {
      requestAnimationFrame(updateScene);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    updateScene();
  }

  createMesh() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    //geometry.computeVertexNormals();
    geometry.center();
    geometry.rotateZ(Math.PI / 2);
    geometry.rotateX(-Math.PI / 2);
    geometry.lookAt(new THREE.Vector3(0, 0, 1));

    const colors = {
      red: '#e74c3c',
      blue: '#3498db',
      green: '#44b098',
      orange: '#f39c12',
    };

    const materialColor = new THREE.Color(colors['red']);

    const material = new THREE.MeshPhongMaterial({
      color: materialColor,
      depthWrite: true,
      vertexColors: THREE.FaceColors,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const size = getDimensions(mesh);

    mesh.position.set(0, size.y, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.set(0.5, 0.5, 0.5);
    this.scene.add(mesh);
  }

  componentDidMount() {
    const viewer = this.viewer.current;
    this.renderScene();
    viewer.appendChild(this.renderer.domElement);
    // Update render on resize window
    window.addEventListener('resize', this.handleResize, false);
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
