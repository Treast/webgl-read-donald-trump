import THREE from './Bundle';

export default class ObjectLoader {
  static loadObject(url) {
    return new Promise((resolve, reject) => {
      let loader = new THREE.OBJLoader();
      loader.load(url, object => {
        resolve(object);
      });
    });
  }

  static loadMaterial(url) {
    return new Promise((resolve, reject) => {
      let loader = new THREE.MTLLoader();
      loader.load(url, material => {
        resolve(material);
      });
    });
  }

  static loadGLTF(url) {
    return new Promise((resolve, reject) => {
      let loader = new THREE.GLTFLoader();
      loader.load(url, gltf => {
        resolve(gltf);
      });
    });
  }

  static loadFBX(url) {
    return new Promise((resolve, reject) => {
      let loader = new THREE.FBXLoader();
      loader.load(url, fbx => {
        resolve(fbx);
      });
    });
  }

  static loadCollada(url) {
    return new Promise((resolve, reject) => {
      let loader = new THREE.ColladaLoader();
      loader.load(url, collada => {
        resolve(collada);
      });
    });
  }

  static loadObjectWithMaterial(objectUrl, materialUrl) {
    return new Promise((resolve, reject) => {
      let objectLoader = new THREE.OBJLoader();
      let materialLoader = new THREE.MTLLoader();

      materialLoader.load(materialUrl, materials => {
        materials.preload();
        objectLoader.setMaterials(materials);
        objectLoader.load(objectUrl, object => {
          resolve(object);
        });
      });
    });
  }
}
