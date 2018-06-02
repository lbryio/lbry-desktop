// @flow
import * as React from 'react';
import * as THREE from 'three';
import detectWebGL from './detector.js';
import OrbitControls from 'three-orbitcontrols';
import { Scene, Camera, Controls, getDimensions } from './threeHelper';
type Props = {};

class ThreeViewer extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    //Main container
    this.viewer = React.createRef();
    // Threejs
    this.scene = Scene(0xeeeeee);

    // Render scene
    if (detectWebGL()) {
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;
      this.renderer.shadowMapEnabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } else {
      // No webgl support
      console.error('NO WEBGL!!!');
    }
  }

  handleResize = () => {
    const viewer = this.viewer.current;
    const width = viewer.offsetWidth;
    const height = viewer.offsetHeight;
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
    const viewer = this.viewer.current;
    const width = viewer.offsetWidth;
    const height = viewer.offsetHeight;
    const aspect = width / height;

    this.renderer.setSize(width, height);

    // Main camera
    this.camera = Camera(aspect);

    this.controls = Controls(this.camera, canvas);
    this.camera.lookAt(new THREE.Vector3(-1, -2, 0));
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

    const material = new THREE.MeshStandardMaterial({
      color: 0x44b098,
      depthWrite: true,
      //side: THREE.DoubleSide,
      shading: THREE.FlatShading,
      vertexColors: THREE.FaceColors,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const size = getDimensions(mesh);

    mesh.position.set(0, size.y, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.set(0.5, 0.5, 0.5);

    this.scene.add(mesh);
    this.camera.position.set(2 * size.x, 2 * size.y, 2 * size.z);
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
