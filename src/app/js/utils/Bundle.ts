import * as THREE from 'three';
(window as any)['THREE'] = THREE;
// Orbit controls
require('three/examples/js/controls/OrbitControls');

// 3D Model loaders
require('three/examples/js/loaders/MTLLoader');
require('three/examples/js/loaders/OBJLoader');
require('three/examples/js/loaders/ColladaLoader');
require('three/examples/js/loaders/GLTFLoader');

export default THREE;
