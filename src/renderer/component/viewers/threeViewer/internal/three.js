import * as THREE from 'three';

// Currently it's not possible to import the files within the "examples/js" directory.
// Fix: https://github.com/mrdoob/three.js/issues/9562#issuecomment-383390251
global.THREE = THREE;
require('three/examples/js/controls/OrbitControls');
require('three/examples/js/loaders/OBJLoader');
require('three/examples/js/loaders/STLLoader');

module.exports = global.THREE;
